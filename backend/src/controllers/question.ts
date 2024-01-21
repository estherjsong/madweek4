import { type NextFunction, type Request, type Response } from 'express';
import { body, matchedData, validationResult } from 'express-validator';

import questionRepository from '@repositories/question';
import { type User } from '@src/schema';

class QuestionController {
  postQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await body('title', '제목을 작성해주세요.')
      .trim()
      .isString()
      .notEmpty()
      .run(req);
    await body('code', '코드를 작성해주세요.')
      .trim()
      .isString()
      .notEmpty()
      .run(req);
    await body('tags.*.id', '태그를 정상적으로 입력해주세요.')
      .optional()
      .isInt()
      .toInt()
      .run(req);
    await body('tags.*.name', '태그를 정상적으로 입력해주세요.')
      .optional()
      .isString()
      .run(req);
    await body('tags.*.type', '태그를 정상적으로 입력해주세요.')
      .optional()
      .isInt()
      .toInt()
      .run(req);
    await body('tags.*', '태그를 정상적으로 입력해주세요.')
      .custom((value) => 'id' in value || ('name' in value && 'type' in value))
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const data = matchedData(req);
    const tagData = data.tags as Array<
      { id: number } | { name: string; type: number }
    >;
    const user = req.user as User;

    try {
      let tags = await Promise.all(
        tagData
          .filter((tag, index) => {
            if ('id' in tag) {
              return (
                tagData.findIndex((e) => 'id' in e && tag.id === e.id) === index
              );
            }
            return (
              tagData.findIndex((e) => 'name' in e && tag.name === e.name) ===
              index
            );
          })
          .map(async (tag) => {
            if ('id' in tag) {
              return await questionRepository.findTagById(tag.id);
            }
            return (
              (await questionRepository.findTagByName(tag.name)) ??
              (await questionRepository.createTag(tag.name, tag.type))
            );
          })
      );

      const question = await questionRepository.createQuestion(
        data.title as string,
        data.code as string,
        user.id
      );

      tags = tags
        .filter(
          (tag, index) => tags.findIndex((e) => e.id === tag.id) === index
        )
        .sort((a, b) => a.id - b.id);

      await questionRepository.createQuestionTags(
        tags.map((tag) => ({
          questionId: question.id,
          tagId: tag.id,
        }))
      );

      res.status(201).json({ success: true, question: { ...question, tags } });
    } catch (error) {
      next(error);
    }
  };
}

export default new QuestionController();
