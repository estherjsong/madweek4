import { type Request } from 'express';
import { body, param } from 'express-validator';

import answerRepository from '@repositories/answer';
import questionRepository from '@repositories/question';
import { createLLMAnswer } from '@src/config/langchain';
import { type Question, type Tag, type User } from '@src/schema';

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
    await body('isRequestAI', 'AI 요청 여부를 정상적으로 입력해주세요.')
      .optional()
      .default(false)
      .isBoolean()
      .toBoolean()
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

  async createAIAnswer(question: Question, tags: Tag[]): Promise<void> {
    const language = tags.find((tag) => tag.type === 1)?.name;
    if (language === undefined) return;

    const aiAnswer = await createLLMAnswer(
      language,
      question.title,
      question.code
    );
    const answer = await answerRepository.createAnswer(
      aiAnswer.code,
      question.id,
      1 // TODO: 임시로 넣은 유저 고유값. 나중에 인공지능 전용으로 계정 하나 만들어야 함
    );
    await answerRepository.createComments(
      answer.id,
      aiAnswer.comments.filter(
        (comment, index) =>
          aiAnswer.comments.findIndex((e) => e.line === comment.line) === index
      )
    );
  }
}

export default new QuestionService();
