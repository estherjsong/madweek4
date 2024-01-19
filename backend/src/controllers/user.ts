import * as argon2 from 'argon2';
import { count, eq } from 'drizzle-orm';
import { type NextFunction, type Request, type Response } from 'express';
import { body, matchedData, validationResult } from 'express-validator';
import passport from 'passport';
import { type IVerifyOptions } from 'passport-local';

import db from '@src/db';
import * as schema from '@src/schema';

export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate(
    'local',
    (error: Error, user: schema.User | false, info: IVerifyOptions) => {
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
};

export const postLogout = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.logOut((error) => {
    if (error != null) {
      next(error);
      return;
    }
    res.status(200).json({ success: true });
  });
};

export const postSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    const duplicateUserId = await db
      .select({ value: count() })
      .from(schema.users)
      .where(eq(schema.users.userId, data.userId));

    if (duplicateUserId[0].value > 0) {
      res
        .status(400)
        .json({ success: false, message: '이미 존재하는 아이디입니다.' });
      return;
    }

    const duplicateNickname = await db
      .select({ value: count() })
      .from(schema.users)
      .where(eq(schema.users.nickname, data.nickname));

    if (duplicateNickname[0].value > 0) {
      res
        .status(400)
        .json({ success: false, message: '이미 존재하는 닉네임입니다.' });
      return;
    }

    const hash = await argon2.hash(data.password);
    const result = await db
      .insert(schema.users)
      .values({
        userId: data.userId,
        password: hash,
        nickname: data.nickname,
      })
      .returning();
    const user = result[0];
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
};
