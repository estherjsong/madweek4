/**
 *  @swagger
 *  tags:
 *    name: Question
 *    description: 질문 관리를 위한 API
 */

import express from 'express';

import { isAuthenticated } from '@config/passport';
import questionController from '@controllers/question';

const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Question:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: 자동 생성된 질문 고유값
 *          title:
 *            type: string
 *            description: 질문의 제목
 *          code:
 *            type: string
 *            description: 질문의 코드
 *          userId:
 *            type: integer
 *            description: 작성자의 유저 고유값
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: 질문을 작성한 날짜와 시각
 *      Tag:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: 자동 생성된 태그 고유값
 *          name:
 *            type: string
 *            description: 태그명
 *          type:
 *            type: integer
 *            description: 태그 종류
 */

/**
 *  @swagger
 *  paths:
 *   /question:
 *     get:
 *       summary: 최근에 올라온 질문 10개 반환
 *       tags: [Question]
 *       parameters:
 *         - in: query
 *           name: offset
 *           schema:
 *             type: integer
 *           description: 스킵할 질문 수
 *       responses:
 *         "200":
 *           description: 최근에 올라온 질문 10개
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Question'
 *                     - type: object
 *                       properties:
 *                         tags:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Tag'
 *                           description: 질문의 태그
 */
router.get('/', questionController.getQuestions);

/**
 *  @swagger
 *  paths:
 *   /question/{id}:
 *     get:
 *       summary: 고유값에 해당하는 질문 반환
 *       tags: [Question]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           description: 질문의 고유값
 *       responses:
 *         "200":
 *           description: 질문
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Question'
 *                   - type: object
 *                     properties:
 *                       tags:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Tag'
 *                         description: 질문의 태그
 */
router.get('/:id', questionController.getQuestion);

/**
 *  @swagger
 *  paths:
 *   /question:
 *     post:
 *       summary: 새로운 질문 생성
 *       tags: [Question]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: 생성할 질문의 제목
 *                 code:
 *                   type: string
 *                   description: 생성할 질문의 코드
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 *                   description: 생성할 질문의 태그
 *       responses:
 *         "201":
 *           description: 새로 생성된 질문
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Question'
 *                   - type: object
 *                     properties:
 *                       tags:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Tag'
 *                         description: 질문의 태그
 */
router.post('/', isAuthenticated, questionController.postQuestion);

/**
 *  @swagger
 *  paths:
 *   /question/{id}:
 *     put:
 *       summary: 작성한 질문 수정
 *       tags: [Question]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           description: 수정할 질문의 고유값
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: 새로 바꿀 질문의 제목
 *                 code:
 *                   type: string
 *                   description: 새로 바꿀 질문의 코드
 *                 tags:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tag'
 *                   description: 새로 바꿀 질문의 태그
 *       responses:
 *         "200":
 *           description: 수정된 질문
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Question'
 *                   - type: object
 *                     properties:
 *                       tags:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Tag'
 *                         description: 질문의 태그
 */
router.put('/:id', isAuthenticated, questionController.putQuestion);

/**
 *  @swagger
 *  paths:
 *   /question/{id}:
 *     delete:
 *       summary: 작성한 질문 삭제
 *       tags: [Question]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           description: 삭제할 질문의 고유값
 *       responses:
 *         "200":
 *           description: 삭제된 질문
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Question'
 *                   - type: object
 *                     properties:
 *                       tags:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Tag'
 *                         description: 질문의 태그
 */
router.delete('/:id', isAuthenticated, questionController.deleteQuestion);

export default router;
