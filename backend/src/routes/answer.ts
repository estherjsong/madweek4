/**
 *  @swagger
 *  tags:
 *    name: Answer
 *    description: 답변 관리를 위한 API
 */

import express from 'express';

import { isAuthenticated } from '@config/passport';
import answerController from '@controllers/answer';

const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Answer:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: 자동 생성된 답변 고유값
 *          code:
 *            type: string
 *            description: 답변의 코드
 *          questionId:
 *            type: integer
 *            description: 답변의 질문 고유값
 *          userId:
 *            type: integer
 *            description: 작성자의 유저 고유값
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: 답변을 작성한 날짜와 시각
 *      AnswerComment:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: 자동 생성된 코멘트 고유값
 *          answerId:
 *            type: integer
 *            description: 답변의 고유값
 *          line:
 *            type: integer
 *            description: 수정한 코드의 라인
 *          description:
 *            type: string
 *            description: 수정한 내용 설명
 *      AnswerLike:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: 자동 생성된 추천 고유값
 *          like:
 *            type: integer
 *            description: "추천 값 (좋아요: 1, 싫어요: -1, 취소: 0)"
 *          answerId:
 *            type: integer
 *            description: 답변의 고유값
 *          userId:
 *            type: integer
 *            description: 작성자 고유값
 */

/**
 *  @swagger
 *  paths:
 *   /answer/{id}:
 *     get:
 *       summary: 고유값에 해당하는 질문의 답변 반환
 *       tags: [Answer]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           description: 질문의 고유값
 *       responses:
 *         "200":
 *           description: 질문의 답변
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Answer'
 *                     - type: object
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *                         like:
 *                           type: integer
 *                           description: 답변의 추천 총합
 *                         comments:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/AnswerComment'
 *                           description: 답변의 코멘트
 */
router.get('/:id(\\d+)/', answerController.getAnswers);

/**
 *  @swagger
 *  paths:
 *   /answer/{id}:
 *     post:
 *       summary: 고유값에 해당하는 질문에 답변 생성
 *       tags: [Answer]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           description: 질문의 고유값
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: 생성할 답변의 코드
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       line:
 *                         type: integer
 *                         description: 수정한 코드의 라인
 *                       description:
 *                         type: string
 *                         description: 수정한 내용 설명
 *                   description: 생성할 답변의 코멘트
 *       responses:
 *         "201":
 *           description: 새로 생성된 답변
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Answer'
 *                   - type: object
 *                     properties:
 *                       comments:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/AnswerComment'
 *                         description: 답변의 코멘트
 */
router.post('/:id(\\d+)/', isAuthenticated, answerController.postAnswer);

/**
 *  @swagger
 *  paths:
 *   /answer/{id}:
 *     put:
 *       summary: 작성한 답변 수정
 *       tags: [Answer]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           description: 수정할 답변의 고유값
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   description: 새로 바꿀 답변의 코드
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       line:
 *                         type: integer
 *                         description: 수정한 코드의 라인
 *                       description:
 *                         type: string
 *                         description: 수정한 내용 설명
 *                   description: 새로 바꿀 답변의 코멘트
 *       responses:
 *         "200":
 *           description: 수정된 답변
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Answer'
 *                   - type: object
 *                     properties:
 *                       comments:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/AnswerComment'
 *                         description: 답변의 코멘트
 */
router.put('/:id(\\d+)/', isAuthenticated, answerController.putAnswer);

/**
 *  @swagger
 *  paths:
 *   /answer/{id}:
 *     delete:
 *       summary: 작성한 답변 삭제
 *       tags: [Answer]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           description: 삭제할 답변의 고유값
 *       responses:
 *         "200":
 *           description: 삭제된 답변
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Answer'
 *                   - type: object
 *                     properties:
 *                       comments:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/AnswerComment'
 *                         description: 답변의 코멘트
 */
router.delete('/:id(\\d+)/', isAuthenticated, answerController.deleteAnswer);

/**
 *  @swagger
 *  paths:
 *   /answer/like/{id}:
 *     get:
 *       summary: 답변에 자기가 한 추천 보기
 *       tags: [Answer]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           description: 답변의 고유값
 *       responses:
 *         "200":
 *           description: 답변에 자기가 한 추천
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AnswerLike'
 */
router.get('/like/:id(\\d+)/', isAuthenticated, answerController.getLike);

/**
 *  @swagger
 *  paths:
 *   /answer/like/{id}:
 *     post:
 *       summary: 답변에 추천 추가
 *       tags: [Answer]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           description: 답변의 고유값
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 like:
 *                   type: integer
 *                   description: "추천 값 (좋아요: 1, 싫어요: -1, 취소: 0)"
 *       responses:
 *         "201":
 *           description: 추천이 반영된 답변
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Answer'
 *                   - type: object
 *                     properties:
 *                       user:
 *                         $ref: '#/components/schemas/User'
 *                       like:
 *                         type: integer
 *                         description: 답변의 추천 총합
 *                       comments:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/AnswerComment'
 *                         description: 답변의 코멘트
 */
router.post('/like/:id(\\d+)/', isAuthenticated, answerController.postLike);

export default router;
