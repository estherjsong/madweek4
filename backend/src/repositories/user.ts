import {
  count,
  desc,
  eq,
  getTableColumns,
  gt,
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

  async findUserByNickname(nickname: string): Promise<schema.User> {
    const [result] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.nickname, nickname));
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
  ): Promise<
    Array<
      schema.Tag & { count: number; questionCount: number; answerCount: number }
    >
  > {
    const questionCount = count(
      sql`case when ${inArray(
        schema.questionTags.questionId,
        db
          .select({ value: schema.questions.id })
          .from(schema.questions)
          .where(eq(schema.questions.userId, id))
      )} then ${schema.tags.id} end`
    );
    const answerCount = count(
      sql`case when ${inArray(
        schema.questionTags.questionId,
        db
          .select({ value: schema.answers.questionId })
          .from(schema.answers)
          .where(eq(schema.answers.userId, id))
      )} then ${schema.tags.id} end`
    );
    const allCount = sql<number>`cast(${questionCount} + ${answerCount} as int)`;
    const result = await db
      .select({
        ...getTableColumns(schema.tags),
        count: allCount,
        questionCount,
        answerCount,
      })
      .from(schema.questionTags)
      .innerJoin(schema.tags, eq(schema.questionTags.tagId, schema.tags.id))
      .where(eq(schema.tags.type, 1))
      .groupBy(schema.tags.id)
      .having(gt(allCount, 0))
      .orderBy(desc(allCount))
      .limit(limit);
    return result;
  }

  async findRankUsers(
    limit: number
  ): Promise<
    Array<Omit<schema.User, 'password'> & { score: number; rank: number }>
  > {
    const { password, ...user } = getTableColumns(schema.users);
    const score = sql<number>`coalesce(cast(sum(${schema.answerLikes.like}) as int), 0)`;
    const result = await db
      .select({
        ...user,
        rank: sql<number>`cast(rank() over (order by ${score} desc) as int)`,
        score,
      })
      .from(schema.users)
      .leftJoin(schema.answers, eq(schema.users.id, schema.answers.userId))
      .leftJoin(
        schema.answerLikes,
        eq(schema.answers.id, schema.answerLikes.answerId)
      )
      .groupBy(schema.users.id)
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

  async updateUserById(
    id: number,
    password: string,
    nickname: string,
    introduction: string
  ): Promise<schema.User> {
    const [result] = await db
      .update(schema.users)
      .set({ password, nickname, introduction })
      .where(eq(schema.users.id, id))
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
}

export default new UserRepository();
