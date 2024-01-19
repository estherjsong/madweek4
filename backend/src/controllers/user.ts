/**
 *  @swagger
 *  tags:
 *    name: User
 *    description: 사용자 관리를 위한 API
 */

import { isAuthenticated } from '@config/passport';
import userRepository from '@repositories/user';
import * as argon2 from 'argon2';
import express from 'express';
import { body, matchedData, validationResult } from 'express-validator';
import passport from 'passport';
import { type IVerifyOptions } from 'passport-local';

import { type User } from '@src/schema';

const router = express.Router();

/**
 *  @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - userId
 *          - password
 *          - nickname
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
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     description: 로그인 성공 여부
 *                   user:
 *                     $ref: '#/components/schemas/User'
 */
router.post('/login', (req, res, next) => {
  passport.authenticate(
    'local',
    (error: Error, user: User | false, info: IVerifyOptions) => {
      if (error != null) {
        next(error);
        return;
      }
      if (user === false) {
        res.status(400).json({ success: false, error: info.message });
        return;
      }
      req.logIn(user, (error) => {
        if (error != null) {
          next(error);
          return;
        }
        res.status(200).json({ success: true, user });
      });
    }
  )(req, res, next);
});

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
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     description: 로그아웃 성공 여부
 */
router.post('/logout', isAuthenticated, (req, res, next) => {
  req.logOut((error) => {
    if (error != null) {
      next(error);
      return;
    }
    res.status(200).json({ success: true });
  });
});

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
 *         "200":
 *           description: 회원가입한 유저
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   success:
 *                     type: boolean
 *                     description: 회원가입 성공 여부
 *                   user:
 *                     $ref: '#/components/schemas/User'
 */
router.post('/signup', async (req, res, next) => {
  await body('userId', '아이디는 6-12자 이내의 영문/숫자만 사용 가능합니다.')
    .trim()
    .isLength({ min: 6, max: 12 })
    .isAlphanumeric()
    .run(req);
  await body('password', '비밀번호는 8자 이상의 문자/숫자가 포함되어야합니다.')
    .trim()
    .isString()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    })
    .run(req);
  await body('confirmPassword', '비밀번호가 일치하지 않습니다.')
    .equals(req.body.password as string)
    .run(req);
  await body('nickname', '닉네임은 3-16자만 사용 가능합니다.')
    .trim()
    .isString()
    .isLength({ min: 3, max: 16 })
    .run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  const data: Record<string, string> = matchedData(req);

  try {
    if ((await userRepository.countUserId(data.userId)) > 0) {
      res
        .status(400)
        .json({ success: false, message: '이미 존재하는 아이디입니다.' });
      return;
    }

    if ((await userRepository.countNickname(data.nickname)) > 0) {
      res
        .status(400)
        .json({ success: false, message: '이미 존재하는 닉네임입니다.' });
      return;
    }

    const hash = await argon2.hash(data.password);
    const user: User = await userRepository.createUser(
      data.userId,
      hash,
      data.nickname
    );
    req.logIn(user, (error) => {
      if (error != null) {
        next(error);
        return;
      }
      res.status(200).json({ success: true, user });
    });
  } catch (error) {
    next(error);
  }
});

export default router;
