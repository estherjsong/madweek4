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
 *          nickname:
 *            type: string
 *            description: 유저 닉네임
 *          profileId:
 *            type: number
 *            description: 프로필 이미지 값
 *          introduction:
 *            type: string
 *            description: 한 줄 자기소개
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: 회원가입한 날짜와 시각
 */

/**
 *  @swagger
 *  paths:
 *   /user/{id}:
 *     get:
 *       summary: 고유값에 해당하는 유저 정보 반환
 *       tags: [User]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: integer
 *           description: 유저의 고유값
 *       responses:
 *         "200":
 *           description: 유저 정보
 *           content:
 *             application/json:
 *               schema:
 *                 allOf:
 *                   - $ref: '#/components/schemas/User'
 *                   - type: object
 *                     properties:
 *                       score:
 *                         type: integer
 *                         description: 유저의 점수
 *                       topLanguages:
 *                         type: array
 *                         items:
 *                           allOf:
 *                             - $ref: '#/components/schemas/Tag'
 *                             - type: object
 *                               properties:
 *                                 count:
 *                                   type: integer
 *                                   description: 총 활동 횟수
 *                                 questionCount:
 *                                   type: integer
 *                                   description: 질문 횟수
 *                                 answerCount:
 *                                   type: integer
 *                                   description: 답변 횟수
 *                         description: 가장 많이 활동한 언어 3개
 *                       questions:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Question'
 *                       answers:
 *                         type: array
 *                         items:
 *                           allOf:
 *                             - $ref: '#/components/schemas/Answer'
 *                             - type: object
 *                               properties:
 *                                 question:
 *                                   $ref: '#/components/schemas/Question'
 */
router.get('/user/:id(\\d+)/', userController.getUser);

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
 *                 profileId:
 *                   type: number
 *                   description: 프로필 이미지 값
 *                 introduction:
 *                   type: string
 *                   description: 가입할 유저 자기소개
 *       responses:
 *         "201":
 *           description: 회원가입한 유저
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */
router.post('/signup', userController.postSignup);

/**
 *  @swagger
 *  paths:
 *   /user:
 *     put:
 *       summary: 회원 정보 수정
 *       tags: [User]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 password:
 *                   type: string
 *                   description: 수정할 유저 비밀번호
 *                 confirmPassword:
 *                   type: string
 *                   description: 비밀번호 확인
 *                 nickname:
 *                   type: string
 *                   description: 수정할 유저 닉네임
 *                 profileId:
 *                   type: number
 *                   description: 프로필 이미지 값
 *                 introduction:
 *                   type: string
 *                   description: 수정할 유저 자기소개
 *       responses:
 *         "200":
 *           description: 수정한 유저 정보
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 */
router.put('/user', isAuthenticated, userController.putUser);

/**
 *  @swagger
 *  paths:
 *   /rank:
 *     get:
 *       summary: 랭킹 상위 유저 5명 반환
 *       tags: [User]
 *       responses:
 *         "200":
 *           description: 랭킹 상위 유저 5명
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         rank:
 *                           type: integer
 *                           description: 유저의 순위
 *                         score:
 *                           type: integer
 *                           description: 유저의 점수
 */
router.get('/rank', userController.getRank);

export default router;
