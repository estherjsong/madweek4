import * as argon2 from 'argon2';
import { type RequestHandler } from 'express';
import { matchedData, validationResult } from 'express-validator';
import passport from 'passport';
import { type IVerifyOptions } from 'passport-local';

import userRepository from '@repositories/user';
import userService from '@services/user';
import { type User } from '@src/schema';

class UserController {
  postLogin: RequestHandler = (req, res, next) => {
    passport.authenticate(
      'local',
      (error: Error, user: User | false, info: IVerifyOptions) => {
        if (error != null) {
          next(error);
          return;
        }
        if (user === false) {
          res.status(400).json({ message: info.message });
          return;
        }
        req.logIn(user, (error) => {
          if (error != null) {
            next(error);
            return;
          }
          res.status(200).json(user);
        });
      }
    )(req, res, next);
  };

  postLogout: RequestHandler = (req, res, next) => {
    req.logOut((error) => {
      if (error != null) {
        next(error);
        return;
      }
      res.status(200).json();
    });
  };

  postSignup: RequestHandler = async (req, res, next) => {
    await userService.validateUser(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: Record<string, string> = matchedData(req);

    try {
      if ((await userRepository.countUserId(data.userId)) > 0) {
        res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
        return;
      }

      if ((await userRepository.countNickname(data.nickname)) > 0) {
        res.status(400).json({ message: '이미 존재하는 닉네임입니다.' });
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
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
