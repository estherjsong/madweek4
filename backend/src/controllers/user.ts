import * as argon2 from 'argon2';
import { type RequestHandler } from 'express';
import { body, matchedData, param, validationResult } from 'express-validator';
import passport from 'passport';
import { type IVerifyOptions } from 'passport-local';

import answerRepository from '@repositories/answer';
import questionRepository from '@repositories/question';
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
      const [user, score, topLanguages, questions, answers] = await Promise.all(
        [
          userRepository.findUserById(data.id),
          userRepository.findUserScoreById(data.id),
          userRepository.findUserTopLanguagesById(data.id, 3),
          questionRepository.findQuestionsByUserId(data.id),
          answerRepository.findAnswersByUserId(data.id),
        ]
      );
      const { password, ...userWithoutPassword } = user;
      res.status(200).json({
        ...userWithoutPassword,
        score,
        topLanguages,
        questions,
        answers,
      });
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
    await body('userId', '아이디는 6-12자 이내의 영문/숫자만 사용 가능합니다.')
      .trim()
      .isString()
      .isLength({ min: 6, max: 12 })
      .isAlphanumeric()
      .custom(async (value: string) => {
        if ((await userRepository.countUserByUserId(value)) > 0) {
          throw new Error('이미 존재하는 아이디입니다.');
        }
      })
      .run(req);
    await userService.validateUser(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data = matchedData(req);

    try {
      const hash = await argon2.hash(data.password as string);
      const user = await userRepository.createUser(
        data.userId as string,
        hash,
        data.nickname as string,
        data.profileId as number,
        data.introduction as string
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

  putUser: RequestHandler = async (req, res, next) => {
    await userService.validateUser(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data = matchedData(req);

    try {
      const hash = await argon2.hash(data.password as string);
      const user = await userRepository.updateUserById(
        (req.user as User).id,
        hash,
        data.nickname as string,
        data.profileId as number,
        data.introduction as string
      );

      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  };

  getRank: RequestHandler = async (req, res, next) => {
    try {
      const users = await userRepository.findRankUsers(5);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
