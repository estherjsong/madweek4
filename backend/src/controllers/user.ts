import * as argon2 from 'argon2';
import { type NextFunction, type Request, type Response } from 'express';
import { body, matchedData, validationResult } from 'express-validator';
import passport from 'passport';
import { type IVerifyOptions } from 'passport-local';

import userRepository from '@repositories/user';
import { type User } from '@src/schema';

class UserController {
  postLogin = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(
      'local',
      (error: Error, user: User | false, info: IVerifyOptions) => {
        if (error != null) {
          next(error);
          return;
        }
        if (user === false) {
          res.status(400).json({ success: false, message: info.message });
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
  };

  postLogout = (req: Request, res: Response, next: NextFunction): void => {
    req.logOut((error) => {
      if (error != null) {
        next(error);
        return;
      }
      res.status(200).json({ success: true });
    });
  };

  postSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await body('userId', '아이디는 6-12자 이내의 영문/숫자만 사용 가능합니다.')
      .trim()
      .isString()
      .isLength({ min: 6, max: 12 })
      .isAlphanumeric()
      .run(req);
    await body(
      'password',
      '비밀번호는 8자 이상의 문자/숫자가 포함되어야합니다.'
    )
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
      const user = await userRepository.createUser(
        data.userId,
        hash,
        data.nickname
      );
      req.logIn(user, (error) => {
        if (error != null) {
          next(error);
          return;
        }
        res.status(201).json({ success: true, user });
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
