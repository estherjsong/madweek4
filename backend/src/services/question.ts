import { type Request } from 'express';
import { body, param } from 'express-validator';

import questionRepository from '@repositories/question';
import { type User } from '@src/schema';

class QuestionService {
  async validateInput(req: Request): Promise<void> {
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
      .optional()
      .custom((value) => 'id' in value || ('name' in value && 'type' in value))
      .run(req);
  }

  async validateQuestion(req: Request): Promise<void> {
    await param('id', '올바르지 않은 질문입니다.')
      .isInt()
      .toInt()
      .custom(async (value: number) => {
        if ((await questionRepository.countQuestionById(value)) === 0) {
          throw new Error();
        }
      })
      .run(req);
  }

  async validateWriter(req: Request): Promise<void> {
    await param('id', '올바르지 않은 질문입니다.')
      .isInt()
      .toInt()
      .custom(async (value: number) => {
        const question = await questionRepository.findQuestionById(value);
        if (question == null) throw new Error();
        if (question.userId !== (req.user as User).id) {
          throw new Error('작성하신 질문이 아닙니다.');
        }
      })
      .run(req);
  }
}

export default new QuestionService();
