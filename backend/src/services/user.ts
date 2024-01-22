import { type Request } from 'express';
import { body } from 'express-validator';

import userRepository from '@repositories/user';

class UserService {
  async validateUser(req: Request): Promise<void> {
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
      .custom(async (value: string) => {
        if ((await userRepository.countUserByNickname(value)) > 0) {
          throw new Error('이미 존재하는 닉네임입니다.');
        }
      })
      .run(req);
    await body('introduction', '자기소개를 작성하셔야 합니다.')
      .trim()
      .isString()
      .notEmpty()
      .run(req);
  }
}

export default new UserService();
