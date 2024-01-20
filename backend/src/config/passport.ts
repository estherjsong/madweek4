import * as argon2 from 'argon2';
import { type NextFunction, type Request, type Response } from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';

import userRepository from '@repositories/user';
import { type User } from '@src/schema';
import logger from '@utils/logger';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, (user as User).id);
  });
});

passport.deserializeUser((id, done) => {
  process.nextTick(() => {
    userRepository
      .findUserById(id as number)
      .then((user) => {
        done(null, user);
      })
      .catch((error) => {
        logger.error(error);
        done(error);
      });
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: 'userId', passwordField: 'password' },
    (userId, password, done) => {
      userRepository
        .findUserByUserId(userId)
        .then((user) => {
          if (user == null) {
            done(null, false, { message: '존재하지 않는 아이디입니다.' });
            return;
          }

          argon2
            .verify(user.password, password)
            .then((isVerified) => {
              if (!isVerified) {
                done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                return;
              }
              done(null, user);
            })
            .catch((error) => {
              logger.error(error);
              done(error);
            });
        })
        .catch((error) => {
          logger.error(error);
          done(error);
        });
    }
  )
);

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res
    .status(401)
    .json({ success: false, message: '로그인을 하지 않았습니다.' });
};
