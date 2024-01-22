/**
 *  @swagger
 *  tags:
 *    name: Tag
 *    description: 태그 관리를 위한 API
 */

import express from 'express';

import tagController from '@controllers/tag';

const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
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
 *   /tag:
 *     get:
 *       summary: 조건에 맞는 태그 10개 반환
 *       tags: [Tag]
 *       parameters:
 *         - in: query
 *           name: offset
 *           schema:
 *             type: integer
 *           description: 스킵할 태그 수
 *         - in: query
 *           name: name
 *           schema:
 *             type: string
 *           description: 검색할 태그명
 *         - in: query
 *           name: type
 *           schema:
 *             type: integer
 *           description: 검색할 태그 종류
 *       responses:
 *         "200":
 *           description: 조건에 맞는 태그 10개
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Tag'
 *                     - type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                           description: 태그 사용 횟수
 */
router.get('/', tagController.getTags);

export default router;
