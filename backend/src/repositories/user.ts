import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  sql,
} from 'drizzle-orm';

import db from '@config/db';
import * as schema from '@src/schema';

class UserRepository {
  async findUserById(id: number): Promise<schema.User> {
    const [result] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return result;
  }

  async findUserByUserId(userId: string): Promise<schema.User> {
    const [result] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.userId, userId));
    return result;
  }

  async findUserScoreById(id: number): Promise<number> {
    const [{ value: result }] = await db
      .select({
        value: sql<number>`coalesce(cast(sum(${schema.answerLikes.like}) as int), 0)`,
      })
      .from(schema.answerLikes)
      .where(
        inArray(
          schema.answerLikes.answerId,
          db
            .select({ value: schema.answers.id })
            .from(schema.answers)
            .where(eq(schema.answers.userId, id))
        )
      );
    return result;
  }

  async findUserTopLanguagesById(
    id: number,
    limit: number
  ): Promise<Array<schema.Tag & { count: number }>> {
    const result = await db
      .select({
        ...getTableColumns(schema.tags),
        count: count(schema.tags.id),
      })
      .from(schema.tags)
      .innerJoin(
        schema.questionTags,
        eq(schema.tags.id, schema.questionTags.tagId)
      )
      .where(
        and(
          eq(schema.tags.type, 1),
          inArray(
            schema.questionTags.questionId,
            db
              .select({ value: schema.questions.id })
              .from(schema.questions)
              .where(eq(schema.questions.userId, id))
          )
        )
      )
      .groupBy(schema.tags.id)
      .orderBy(desc(count(schema.tags.id)))
      .limit(limit);
    return result;
  }

  async createUser(
    userId: string,
    password: string,
    nickname: string,
    introduction: string
  ): Promise<schema.User> {
    const [result] = await db
      .insert(schema.users)
      .values({ userId, password, nickname, introduction })
      .returning();
    return result;
  }

  async countUserById(id: number): Promise<number> {
    const [{ value: result }] = await db
      .select({ value: count() })
      .from(schema.users)
      .where(eq(schema.users.id, id));
    return result;
  }

  async countUserByUserId(userId: string): Promise<number> {
    const [{ value: result }] = await db
      .select({ value: count() })
      .from(schema.users)
      .where(eq(schema.users.userId, userId));
    return result;
  }

  async countUserByNickname(nickname: string): Promise<number> {
    const [{ value: result }] = await db
      .select({ value: count() })
      .from(schema.users)
      .where(eq(schema.users.nickname, nickname));
    return result;
  }
}

export default new UserRepository();
