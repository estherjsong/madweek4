/**
 *  @swagger
 *  tags:
 *    name: Notification
 *    description: 알림 관리를 위한 API
 */

import express from 'express';

import { isAuthenticated } from '@config/passport';
import notificationController from '@controllers/notification';

const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Notification:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: 자동 생성된 알림 고유값
 *          content:
 *            type: string
 *            description: 유저에게 보일 알림 내용
 *          redirect:
 *            type: string
 *            description: 클릭 시 이동할 URL
 *          userId:
 *            type: string
 *            description: 알림이 온 유저의 고유값
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: 알림이 온 날짜와 시각
 */

/**
 *  @swagger
 *  paths:
 *   /notification:
 *     get:
 *       summary: 자신에게 온 최신 알림 5개 반환
 *       tags: [Notification]
 *       responses:
 *         "200":
 *           description: 최신 알림 5개
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Notification'
 */
router.get('/', isAuthenticated, notificationController.getNotifications);

/**
 *  @swagger
 *  paths:
 *   /notification/{id}:
 *     delete:
 *       summary: 자신에게 온 알림 삭제
 *       tags: [Notification]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           description: 삭제할 알림의 고유값
 *       responses:
 *         "200":
 *           description: 삭제된 알림
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Notification'
 */
router.delete(
  '/:id(\\d+)/',
  isAuthenticated,
  notificationController.deleteNotification
);

export default router;
