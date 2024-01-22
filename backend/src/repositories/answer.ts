import { and, count, eq, getTableColumns, inArray, sql } from 'drizzle-orm';

import db from '@src/db';
import * as schema from '@src/schema';

class AnswerRepository {
  async findAnswerById(
    id: number
  ): Promise<
    schema.Answer & { user: Omit<schema.User, 'password'>; like: number }
  > {
    const { password, ...user } = getTableColumns(schema.users);
    const [result] = await db
      .select({
        ...getTableColumns(schema.answers),
        user,
        like: sql<number>`coalesce(cast(sum(${schema.answerLikes.like}) as int), 0)`,
      })
      .from(schema.answers)
      .where(eq(schema.answers.id, id))
      .leftJoin(
        schema.answerLikes,
        eq(schema.answers.id, schema.answerLikes.answerId)
      )
      .innerJoin(schema.users, eq(schema.answers.userId, schema.users.id))
      .groupBy(schema.answers.id, schema.users.id);
    return result;
  }

  async findAnswersByQuestionId(
    questionId: number
  ): Promise<
    Array<schema.Answer & { user: Omit<schema.User, 'password'>; like: number }>
  > {
    const { password, ...user } = getTableColumns(schema.users);
    const result = await db
      .select({
        ...getTableColumns(schema.answers),
        user,
        like: sql<number>`coalesce(cast(sum(${schema.answerLikes.like}) as int), 0)`,
      })
      .from(schema.answers)
      .where(eq(schema.answers.questionId, questionId))
      .leftJoin(
        schema.answerLikes,
        eq(schema.answers.id, schema.answerLikes.answerId)
      )
      .innerJoin(schema.users, eq(schema.answers.userId, schema.users.id))
      .groupBy(schema.answers.id, schema.users.id);
    return result;
  }

  async findCommentsByAnswerId(
    answerId: number
  ): Promise<schema.AnswerComment[]> {
    const result = await db
      .select()
      .from(schema.answerComments)
      .where(eq(schema.answerComments.answerId, answerId));
    return result;
  }

  async createAnswer(
    code: string,
    questionId: number,
    userId: number
  ): Promise<schema.Answer> {
    const [result] = await db
      .insert(schema.answers)
      .values({ code, questionId, userId })
      .returning();
    return result;
  }

  async createComments(
    answerId: number,
    comments: Array<{ line: number; description: string }>
  ): Promise<schema.AnswerComment[] | null> {
    if (comments.length === 0) return null;
    const result = await db
      .insert(schema.answerComments)
      .values(
        comments.map((comment) => ({
          answerId,
          line: comment.line,
          description: comment.description,
        }))
      )
      .onConflictDoUpdate({
        target: [schema.answerComments.answerId, schema.answerComments.line],
        set: { description: sql`excluded.description` },
      })
      .returning();
    return result;
  }

  async createLike(
    like: number,
    answerId: number,
    userId: number
  ): Promise<schema.AnswerLike> {
    const [result] = await db
      .insert(schema.answerLikes)
      .values({ like, answerId, userId })
      .onConflictDoUpdate({
        target: [schema.answerLikes.answerId, schema.answerLikes.userId],
        set: { like: sql`excluded.like` },
      })
      .returning();
    return result;
  }

  async updateAnswerById(id: number, code: string): Promise<schema.Answer> {
    const [result] = await db
      .update(schema.answers)
      .set({ code })
      .where(eq(schema.answers.id, id))
      .returning();
    return result;
  }

  async deleteAnswerById(id: number): Promise<schema.Answer> {
    const [result] = await db
      .delete(schema.answers)
      .where(eq(schema.answers.id, id))
      .returning();
    return result;
  }

  async deleteCommentsByIds(
    id: number[]
  ): Promise<schema.AnswerComment[] | null> {
    if (id.length === 0) return null;
    const result = await db
      .delete(schema.answerComments)
      .where(inArray(schema.answerComments.id, id))
      .returning();
    return result;
  }

  async deleteLikesByAnswerId(answerId: number): Promise<schema.AnswerLike[]> {
    const result = await db
      .delete(schema.answerLikes)
      .where(eq(schema.answerLikes.answerId, answerId))
      .returning();
    return result;
  }

  async countAnswerByQuestionIdAndUserId(
    questionId: number,
    userId: number
  ): Promise<number> {
    const [{ value: result }] = await db
      .select({ value: count() })
      .from(schema.answers)
      .where(
        and(
          eq(schema.answers.questionId, questionId),
          eq(schema.answers.userId, userId)
        )
      );
    return result;
  }
}

export default new AnswerRepository();
