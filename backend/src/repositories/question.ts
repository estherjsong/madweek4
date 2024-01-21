import { count, desc, eq, inArray } from 'drizzle-orm';

import db from '@src/db';
import * as schema from '@src/schema';

class QuestionRepository {
  async findQuestions(
    limit: number,
    offset: number
  ): Promise<schema.Question[]> {
    const result = await db
      .select()
      .from(schema.questions)
      .orderBy(desc(schema.questions.createdAt))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async findQuestionById(id: number): Promise<schema.Question> {
    const result = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.id, id));
    return result[0];
  }

  async findTagById(id: number): Promise<schema.Tag> {
    const result = await db
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.id, id));
    return result[0];
  }

  async findTagByName(name: string): Promise<schema.Tag> {
    const result = await db
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.name, name));
    return result[0];
  }

  async findTagsByQuestionId(questionId: number): Promise<schema.Tag[]> {
    const result = await db
      .select()
      .from(schema.tags)
      .where(
        inArray(
          schema.tags.id,
          db
            .select({ value: schema.questionTags.tagId })
            .from(schema.questionTags)
            .where(eq(schema.questionTags.questionId, questionId))
        )
      );
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

  async createTag(name: string, type: number): Promise<schema.Tag> {
    const result = await db
      .insert(schema.tags)
      .values({ name, type })
      .returning();
    return result[0];
  }

  async createQuestionTags(
    questionTags: Array<{ questionId: number; tagId: number }>
  ): Promise<schema.QuestionTag[] | null> {
    if (questionTags.length === 0) return null;
    const result = await db
      .insert(schema.questionTags)
      .values(questionTags)
      .onConflictDoNothing()
      .returning();
    return result;
  }

  async updateQuestion(
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

  async deleteQuestionTagsByTagId(id: number): Promise<schema.QuestionTag[]> {
    const result = await db
      .delete(schema.questionTags)
      .where(eq(schema.questionTags.tagId, id))
      .returning();
    return result;
  }

  async deleteQuestionTagsByTagIds(
    id: number[]
  ): Promise<schema.QuestionTag[] | null> {
    if (id.length === 0) return null;
    const result = await db
      .delete(schema.questionTags)
      .where(inArray(schema.questionTags.tagId, id))
      .returning();
    return result;
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
