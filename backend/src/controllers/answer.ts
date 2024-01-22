import { type RequestHandler } from 'express';
import { body, matchedData, param, validationResult } from 'express-validator';

import answerRepository from '@repositories/answer';
import questionRepository from '@repositories/question';
import answerService from '@services/answer';
import questionService from '@services/question';
import { type User } from '@src/schema';

class AnswerController {
  getAnswers: RequestHandler = async (req, res, next) => {
    await questionService.validateQuestion(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: Record<string, number> = matchedData(req);

    try {
      const answers = await answerRepository.findAnswersByQuestionId(data.id);
      const answersWithComments = await Promise.all(
        answers.map(async (answer) => ({
          ...answer,
          comments: await answerRepository.findCommentsByAnswerId(answer.id),
        }))
      );

      res.status(200).json(answersWithComments);
    } catch (error) {
      next(error);
    }
  };

  postAnswer: RequestHandler = async (req, res, next) => {
    await param('id', '올바르지 않은 질문입니다.')
      .isInt()
      .toInt()
      .custom(async (value: number) => {
        const question = await questionRepository.findQuestionById(value);
        if (question == null) throw new Error();

        const user = req.user as User;
        if (question.userId === user.id) {
          throw new Error('사용자가 작성한 질문입니다.');
        }
        if (
          (await answerRepository.countAnswerByQuestionIdAndUserId(
            value,
            user.id
          )) > 0
        ) {
          throw new Error('이미 답변을 작성하셨습니다.');
        }
      })
      .run(req);
    await answerService.validateInput(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data = matchedData(req);
    const user = req.user as User;

    try {
      const commentData = data.comments as Array<{
        line: number;
        description: string;
      }>;
      const answer = await answerRepository.createAnswer(
        data.code as string,
        data.id as number,
        user.id
      );
      const comments = await answerRepository.createComments(
        answer.id,
        commentData.filter(
          (comment, index) =>
            commentData.findIndex((e) => e.line === comment.line) === index
        )
      );

      res.status(201).json({ ...answer, comments });
    } catch (error) {
      next(error);
    }
  };

  putAnswer: RequestHandler = async (req, res, next) => {
    await answerService.validateWriter(req);
    await answerService.validateInput(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data = matchedData(req);

    try {
      const commentData = data.comments as Array<{
        line: number;
        description: string;
      }>;
      const answer = await answerRepository.updateAnswerById(
        data.id as number,
        data.code as string
      );

      const comments = await answerRepository.findCommentsByAnswerId(answer.id);
      const newComments =
        (await answerRepository.createComments(
          answer.id,
          commentData.filter(
            (comment, index) =>
              commentData.findIndex((e) => e.line === comment.line) === index
          )
        )) ?? [];

      await answerRepository.deleteCommentsByIds(
        comments
          .filter((comment) => !newComments.some((e) => comment.id === e.id))
          .map((comment) => comment.id)
      );

      res.status(200).json({ ...answer, comments: newComments });
    } catch (error) {
      next(error);
    }
  };

  deleteAnswer: RequestHandler = async (req, res, next) => {
    await answerService.validateWriter(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: Record<string, number> = matchedData(req);

    try {
      const answer = await answerRepository.deleteAnswerById(data.id);
      const comments = await answerRepository.findCommentsByAnswerId(answer.id);
      await answerRepository.deleteCommentsByIds(
        comments.map((comment) => comment.id)
      );
      await answerRepository.deleteLikesByAnswerId(answer.id);
      res.status(200).json({ ...answer, comments });
    } catch (error) {
      next(error);
    }
  };

  postLike: RequestHandler = async (req, res, next) => {
    await answerService.validateNotWriter(req);
    await body('like', '올바르지 않은 좋아요입니다.')
      .optional()
      .default(1)
      .isInt()
      .toInt()
      .isIn([-1, 0, 1])
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data = matchedData(req);
    const user = req.user as User;

    try {
      const like = await answerRepository.createLike(
        data.like as number,
        data.id as number,
        user.id
      );
      const answer = await answerRepository.findAnswerById(like.answerId);
      res.status(201).json(answer);
    } catch (error) {
      next(error);
    }
  };
}

export default new AnswerController();
