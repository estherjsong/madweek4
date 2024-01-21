import {
  type SQLWrapper,
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
} from 'drizzle-orm';

import db from '@src/db';
import * as schema from '@src/schema';

class QuestionRepository {
  async findQuestionById(
    id: number
  ): Promise<schema.Question & { user: Omit<schema.User, 'password'> }> {
    const { password, ...user } = getTableColumns(schema.users);

    const result = await db
      .select({ ...getTableColumns(schema.questions), user })
      .from(schema.questions)
      .innerJoin(schema.users, eq(schema.questions.userId, schema.users.id))
      .where(eq(schema.questions.id, id));
    return result[0];
  }

  async searchQuestions(
    limit: number,
    offset: number,
    title?: string,
    nickname?: string,
    tag?: string
  ): Promise<Array<schema.Question & { user: Omit<schema.User, 'password'> }>> {
    const conditions: SQLWrapper[] = [];

    if (title !== undefined) {
      conditions.push(ilike(schema.questions.title, `%${title}%`));
    }

    if (nickname !== undefined) {
      conditions.push(ilike(schema.users.nickname, `%${nickname}%`));
    }

    if (tag !== undefined) {
      conditions.push(
        inArray(
          schema.questions.id,
          db
            .selectDistinct({ questionId: schema.questionTags.questionId })
            .from(schema.tags)
            .where(ilike(schema.tags.name, `%${tag}%`))
            .leftJoin(
              schema.questionTags,
              eq(schema.tags.id, schema.questionTags.tagId)
            )
        )
      );
    }

    const { password, ...user } = getTableColumns(schema.users);

    const result = await db
      .select({ ...getTableColumns(schema.questions), user })
      .from(schema.questions)
      .innerJoin(schema.users, eq(schema.questions.userId, schema.users.id))
      .where(and(...conditions))
      .orderBy(desc(schema.questions.createdAt))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async createQuestion(
    title: string,
    code: string,
    userId: number
  ): Promise<schema.Question> {
    const result = await db
      .insert(schema.questions)
      .values({ title, code, userId })
      .returning();
    return result[0];
  }

  async updateQuestionById(
    id: number,
    title: string,
    code: string
  ): Promise<schema.Question> {
    const result = await db
      .update(schema.questions)
      .set({ title, code })
      .where(eq(schema.questions.id, id))
      .returning();
    return result[0];
  }

  async deleteQuestionById(id: number): Promise<schema.Question> {
    const result = await db
      .delete(schema.questions)
      .where(eq(schema.questions.id, id))
      .returning();
    return result[0];
  }

  async countQuestionById(id: number): Promise<number> {
    const result = await db
      .select({ value: count() })
      .from(schema.questions)
      .where(eq(schema.questions.id, id));
    return result[0].value;
  }
}

export default new QuestionRepository();
