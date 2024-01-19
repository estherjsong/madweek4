import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { type NextFunction, type Request, type Response } from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';

import db from '@src/db';
import * as schema from '@src/schema';
import logger from '@utils/logger';

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, (user as schema.User).id);
  });
});

passport.deserializeUser((id, done) => {
  process.nextTick(() => {
    db.select()
      .from(schema.users)
      .where(eq(schema.users.id, id as number))
      .then((res) => {
        done(null, res[0]);
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
    (id, password, done) => {
      db.select()
        .from(schema.users)
        .where(eq(schema.users.userId, id))
        .then((res) => {
          if (res.length === 0) {
            done(null, false, { message: '존재하지 않는 아이디입니다.' });
            return;
          }

          const user = res[0];
          argon2
            .verify(user.password, password)
            .then((isVerified) => {
              if (!isVerified) {
                done(null, false, {
                  message: '비밀번호가 일치하지 않습니다.',
                });
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
