/**
 *  @swagger
 *  tags:
 *    name: User
 *    description: 사용자 관리를 위한 API
 */

import express from 'express';

import { isAuthenticated } from '@config/passport';
import userController from '@controllers/user';

const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: 자동 생성된 유저 고유값
 *          userId:
 *            type: string
 *            description: 로그인할 때 사용되는 유저 아이디
 *          password:
 *            type: string
 *            description: 로그인할 때 사용되는 유저 비밀번호
 *          nickname:
 *            type: string
 *            description: 유저 닉네임
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: 회원가입한 날짜와 시각
 */

/**
 *  @swagger
 *  paths:
 *   /login:
 *     post:
 *       summary: 아이디와 비밀번호로 로그인
 *       tags: [User]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: 로그인할 유저 아이디
 *                 password:
 *                   type: string
 *                   description: 로그인할 유저 비밀번호
 *       responses:
 *         "200":
 *           description: 로그인된 유저
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         "400":
 *           description: 로그인 오류
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     desciprtion: 오류 메시지
 */
router.post('/login', userController.postLogin);

/**
 *  @swagger
 *  paths:
 *   /logout:
 *     post:
 *       summary: 로그아웃
 *       tags: [User]
 *       responses:
 *         "200":
 *           description: 로그아웃 성공 여부
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 */
router.post('/logout', isAuthenticated, userController.postLogout);

/**
 *  @swagger
 *  paths:
 *   /signup:
 *     post:
 *       summary: 아이디와 비밀번호로 회원가입
 *       tags: [User]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: 가입할 유저 아이디
 *                 password:
 *                   type: string
 *                   description: 가입할 유저 비밀번호
 *                 confirmPassword:
 *                   type: string
 *                   description: 비밀번호 확인
 *                 nickname:
 *                   type: string
 *                   description: 가입할 유저 닉네임
 *       responses:
 *         "201":
 *           description: 회원가입한 유저
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         "400":
 *           description: 회원가입 오류
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     desciprtion: 오류 메시지
 */
router.post('/signup', userController.postSignup);

export default router;
