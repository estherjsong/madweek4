import { type RequestHandler } from 'express';
import { matchedData, param, query, validationResult } from 'express-validator';

import questionRepository from '@repositories/question';
import questionService from '@services/question';
import { type User } from '@src/schema';

class QuestionController {
  getQuestions: RequestHandler = async (req, res, next) => {
    await query('offset', '올바르지 않은 오프셋입니다.')
      .optional()
      .default(0)
      .isInt()
      .toInt()
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: Record<string, number> = matchedData(req);

    try {
      const questions = await questionRepository.findQuestions(10, data.offset);
      const questionWithTags = await Promise.all(
        questions.map(async (question) => ({
          ...question,
          tags: await questionRepository.findTagsByQuestionId(question.id),
        }))
      );
      res.status(200).json(questionWithTags);
    } catch (error) {
      next(error);
    }
  };

  getQuestion: RequestHandler = async (req, res, next) => {
    await param('id', '올바르지 않은 질문입니다.')
      .isInt()
      .toInt()
      .custom(async (value: number) => {
        if ((await questionRepository.countQuestionById(value)) === 0) {
          throw new Error();
        }
      })
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: Record<string, number> = matchedData(req);

    try {
      const question = await questionRepository.findQuestionById(data.id);
      const tags = await questionRepository.findTagsByQuestionId(question.id);

      res.status(200).json({ ...question, tags });
    } catch (error) {
      next(error);
    }
  };

  postQuestion: RequestHandler = async (req, res, next) => {
    await questionService.validateQuestion(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data = matchedData(req);
    const user = req.user as User;

    try {
      const tags = await questionService.getTagsByBodyData(data.tags || []);
      const question = await questionRepository.createQuestion(
        data.title as string,
        data.code as string,
        user.id
      );

      await questionRepository.createQuestionTags(
        tags.map((tag) => ({
          questionId: question.id,
          tagId: tag.id,
        }))
      );

      res.status(201).json({ ...question, tags });
    } catch (error) {
      next(error);
    }
  };

  putQuestion: RequestHandler = async (req, res, next) => {
    await questionService.validateWriter(req);
    await questionService.validateQuestion(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data = matchedData(req);

    try {
      const newTags = await questionService.getTagsByBodyData(data.tags || []);
      const question = await questionRepository.updateQuestion(
        data.id as number,
        data.title as string,
        data.code as string
      );

      const tags = await questionRepository.findTagsByQuestionId(question.id);
      await questionRepository.deleteQuestionTagsByTagIds(
        tags
          .filter((tag) => !newTags.some((e) => tag.id === e.id))
          .map((tag) => tag.id)
      );

      await questionRepository.createQuestionTags(
        newTags.map((tag) => ({
          questionId: question.id,
          tagId: tag.id,
        }))
      );

      res.status(200).json({ ...question, tags: newTags });
    } catch (error) {
      next(error);
    }
  };

  deleteQuestion: RequestHandler = async (req, res, next) => {
    await questionService.validateWriter(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: Record<string, number> = matchedData(req);

    try {
      const question = await questionRepository.deleteQuestionById(data.id);
      const tags = await questionRepository.findTagsByQuestionId(question.id);
      await questionRepository.deleteQuestionTagsByTagId(question.id);
      return res.status(200).json({ ...question, tags });
    } catch (error) {
      next(error);
    }
  };
}

export default new QuestionController();
