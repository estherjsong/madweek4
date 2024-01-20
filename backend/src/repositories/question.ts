import { eq } from 'drizzle-orm';

import db from '@src/db';
import * as schema from '@src/schema';

class QuestionRepository {
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
  ): Promise<schema.QuestionTag> {
    const result = await db
      .insert(schema.questionTags)
      .values(questionTags)
      .returning();
    return result[0];
  }
}

export default new QuestionRepository();
