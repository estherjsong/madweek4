import { type RequestHandler } from 'express';
import { matchedData, query, validationResult } from 'express-validator';

import tagRepository from '@repositories/tag';
import tagService from '@services/tag';
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
    await query('title', '올바르지 않은 제목입니다.')
      .optional()
      .isString()
      .run(req);
    await query('nickname', '올바르지 않은 닉네임입니다.')
      .optional()
      .isString()
      .run(req);
    await query('tag', '올바르지 않은 태그입니다.')
      .optional()
      .isString()
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data = matchedData(req);

    try {
      const count = await questionRepository.countQuestions(
        data.title as string | undefined,
        data.nickname as string | undefined,
        data.tag as string | undefined
      );
      const questions = await questionRepository.searchQuestions(
        10,
        data.offset as number,
        data.title as string | undefined,
        data.nickname as string | undefined,
        data.tag as string | undefined
      );
      const questionWithTags = await Promise.all(
        questions.map(async (question) => ({
          ...question,
          tags: await tagRepository.findTagsByQuestionId(question.id),
        }))
      );
      res.status(200).json({ count, questions: questionWithTags });
    } catch (error) {
      next(error);
    }
  };

  getQuestion: RequestHandler = async (req, res, next) => {
    await questionService.validateQuestion(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: Record<string, number> = matchedData(req);

    try {
      const question = await questionRepository.findQuestionById(data.id);
      const tags = await tagRepository.findTagsByQuestionId(question.id);

      res.status(200).json({ ...question, tags });
    } catch (error) {
      next(error);
    }
  };

  postQuestion: RequestHandler = async (req, res, next) => {
    await questionService.validateInput(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data = matchedData(req);
    const user = req.user as User;

    try {
      const tags = await tagService.getTagsByBodyData(data.tags || []);
      const question = await questionRepository.createQuestion(
        data.title as string,
        data.code as string,
        user.id
      );

      await tagRepository.createQuestionTags(
        question.id,
        tags.map((tag) => tag.id)
      );

      if (data.isRequestAI) {
        await questionService.pipelineAIAnswer(question, tags, res);
      } else {
        res.status(201).json({ ...question, tags });
      }
    } catch (error) {
      next(error);
    }
  };

  putQuestion: RequestHandler = async (req, res, next) => {
    await questionService.validateWriter(req);
    await questionService.validateInput(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data = matchedData(req);

    try {
      const newTags = await tagService.getTagsByBodyData(data.tags || []);
      const question = await questionRepository.updateQuestionById(
        data.id as number,
        data.title as string,
        data.code as string
      );

      const tags = await tagRepository.findTagsByQuestionId(question.id);
      await tagRepository.deleteQuestionTagsByTagIds(
        tags
          .filter((tag) => !newTags.some((e) => tag.id === e.id))
          .map((tag) => tag.id)
      );

      await tagRepository.createQuestionTags(
        question.id,
        newTags.map((tag) => tag.id)
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
      const tags = await tagRepository.findTagsByQuestionId(question.id);
      await tagRepository.deleteQuestionTagsByTagIds(tags.map((tag) => tag.id));
      return res.status(200).json({ ...question, tags });
    } catch (error) {
      next(error);
    }
  };
}

export default new QuestionController();
