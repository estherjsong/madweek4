import * as argon2 from 'argon2';
import { type RequestHandler } from 'express';
import { matchedData, param, validationResult } from 'express-validator';
import passport from 'passport';
import { type IVerifyOptions } from 'passport-local';

import userRepository from '@repositories/user';
import userService from '@services/user';
import { type User } from '@src/schema';

class UserController {
  getUser: RequestHandler = async (req, res, next) => {
    await param('id', '올바르지 않은 유저입니다.')
      .isInt()
      .toInt()
      .custom(async (value: number) => {
        if ((await userRepository.countUserById(value)) === 0) {
          throw new Error();
        }
      })
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: Record<string, number> = matchedData(req);

    try {
      const [user, score, topLanguages] = await Promise.all([
        userRepository.findUserById(data.id),
        userRepository.findUserScoreById(data.id),
        userRepository.findUserTopLanguagesById(data.id, 3),
      ]);
      const { password, ...userWithoutPassword } = user;
      res.status(200).json({ ...userWithoutPassword, score, topLanguages });
    } catch (error) {
      next(error);
    }
  };

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

          const { password, ...userWithoutPassword } = user;
          res.status(200).json(userWithoutPassword);
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
      const hash = await argon2.hash(data.password);
      const user = await userRepository.createUser(
        data.userId,
        hash,
        data.nickname,
        data.introduction
      );
      req.logIn(user, (error) => {
        if (error != null) {
          next(error);
          return;
        }

        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
