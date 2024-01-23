import { type Request } from 'express';
import { body, param } from 'express-validator';

import answerRepository from '@repositories/answer';
import { type User } from '@src/schema';

class AnswerService {
  async validateInput(req: Request): Promise<void> {
    await body('code', '코드를 작성해주세요.')
      .trim()
      .isString()
      .notEmpty()
      .run(req);
    await body('comments.*.line', '코멘트를 정상적으로 입력해주세요.')
      .isInt()
      .toInt()
      .run(req);
    await body('comments.*.description', '코멘트를 정상적으로 입력해주세요.')
      .trim()
      .isString()
      .notEmpty()
      .run(req);
  }

  async validateAnswer(req: Request): Promise<void> {
    await param('id', '올바르지 않은 답변입니다.')
      .isInt()
      .toInt()
      .custom(async (value: number) => {
        if ((await answerRepository.countAnswerById(value)) === 0) {
          throw new Error();
        }
      })
      .run(req);
  }

  async validateWriter(req: Request): Promise<void> {
    await param('id', '올바르지 않은 답변입니다.')
      .isInt()
      .toInt()
      .custom(async (value: number) => {
        const answer = await answerRepository.findAnswerById(value);
        if (answer == null) throw new Error();
        if (answer.userId !== (req.user as User).id) {
          throw new Error('작성하신 답변이 아닙니다.');
        }
      })
      .run(req);
  }

  async validateNotWriter(req: Request): Promise<void> {
    await param('id', '올바르지 않은 답변입니다.')
      .isInt()
      .toInt()
      .custom(async (value: number) => {
        const answer = await answerRepository.findAnswerById(value);
        if (answer == null) throw new Error();
        if (answer.userId === (req.user as User).id) {
          throw new Error('사용자가 작성한 답변입니다.');
        }
      })
      .run(req);
  }
}

export default new AnswerService();
