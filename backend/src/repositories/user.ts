import { count, eq } from 'drizzle-orm';

import db from '@src/db';
import * as schema from '@src/schema';

class UserRepository {
  async findUserById(id: number): Promise<schema.User> {
    const result = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return result[0];
  }

  async findUserByUserId(userId: string): Promise<schema.User> {
    const result = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.userId, userId));
    return result[0];
  }

  async createUser(
    userId: string,
    password: string,
    nickname: string
  ): Promise<schema.User> {
    const result = await db
      .insert(schema.users)
      .values({ userId, password, nickname })
      .returning();
    return result[0];
  }

  async countUserId(userId: string): Promise<number> {
    const result = await db
      .select({ value: count() })
      .from(schema.users)
      .where(eq(schema.users.userId, userId));
    return result[0].value;
  }

  async countNickname(nickname: string): Promise<number> {
    const result = await db
      .select({ value: count() })
      .from(schema.users)
      .where(eq(schema.users.nickname, nickname));
    return result[0].value;
  }
}

export default new UserRepository();
