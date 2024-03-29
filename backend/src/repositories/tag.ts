import {
  type SQLWrapper,
  and,
  count,
  desc,
  eq,
  getTableColumns,
  ilike,
  inArray,
  or,
} from 'drizzle-orm';

import db from '@config/db';
import * as schema from '@src/schema';

class TagRepository {
  async findTagById(id: number): Promise<schema.Tag> {
    const [result] = await db
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.id, id));
    return result;
  }

  async findTagByName(name: string): Promise<schema.Tag> {
    const [result] = await db
      .select()
      .from(schema.tags)
      .where(eq(schema.tags.name, name));
    return result;
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

  async searchTags(
    limit: number,
    offset: number,
    name?: string,
    type?: number
  ): Promise<Array<schema.Tag & { count: number }>> {
    const conditions: SQLWrapper[] = [];

    if (name !== undefined) {
      conditions.push(ilike(schema.tags.name, `%${name}%`));
    }

    if (type !== undefined) {
      conditions.push(eq(schema.tags.type, type));
    }

    const result = await db
      .select({
        ...getTableColumns(schema.tags),
        count: count(schema.questionTags),
      })
      .from(schema.tags)
      .where(or(...conditions))
      .leftJoin(
        schema.questionTags,
        eq(schema.tags.id, schema.questionTags.tagId)
      )
      .groupBy(schema.tags.id)
      .orderBy(desc(count(schema.questionTags)))
      .limit(limit)
      .offset(offset);
    return result;
  }

  async createTag(name: string, type: number): Promise<schema.Tag> {
    const [result] = await db
      .insert(schema.tags)
      .values({ name, type })
      .returning();
    return result;
  }

  async createQuestionTags(
    questionId: number,
    tagId: number[]
  ): Promise<schema.QuestionTag[] | null> {
    if (tagId.length === 0) return null;
    const result = await db
      .insert(schema.questionTags)
      .values(tagId.map((tagId) => ({ questionId, tagId })))
      .onConflictDoNothing()
      .returning();
    return result;
  }

  async deleteQuestionTagsByQuestionIdAndTagIds(
    questionId: number,
    tagId: number[]
  ): Promise<schema.QuestionTag[] | null> {
    if (tagId.length === 0) return null;
    const result = await db
      .delete(schema.questionTags)
      .where(
        and(
          eq(schema.questionTags.questionId, questionId),
          inArray(schema.questionTags.tagId, tagId)
        )
      )
      .returning();
    return result;
  }

  async countTags(name?: string, type?: number): Promise<number> {
    const conditions: SQLWrapper[] = [];

    if (name !== undefined) {
      conditions.push(ilike(schema.tags.name, `%${name}%`));
    }

    if (type !== undefined) {
      conditions.push(eq(schema.tags.type, type));
    }

    const [{ value: result }] = await db
      .select({ value: count() })
      .from(schema.tags)
      .where(and(...conditions));
    return result;
  }
}

export default new TagRepository();
