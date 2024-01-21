import {
  integer,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 20 }).notNull().unique(),
  password: text('password').notNull(),
  nickname: varchar('nickname', { length: 20 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  code: text('code').notNull(),
  userId: integer('user_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 20 }).notNull().unique(),
  type: smallint('type').notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export const questionTags = pgTable(
  'question_tags',
  {
    id: serial('id').primaryKey(),
    questionId: integer('question_id').notNull(),
    tagId: integer('tag_id').notNull(),
  },
  (t) => ({
    unq: unique().on(t.questionId, t.tagId),
  })
);

export type QuestionTag = typeof questionTags.$inferSelect;
export type NewQuestionTag = typeof questionTags.$inferInsert;
