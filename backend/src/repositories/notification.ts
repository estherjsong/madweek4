import { desc, eq } from 'drizzle-orm';

import db from '@config/db';
import * as schema from '@src/schema';

class NotificationRepository {
  async findNotificationById(id: number): Promise<schema.Notification> {
    const [result] = await db
      .select()
      .from(schema.notifications)
      .where(eq(schema.notifications.id, id));
    return result;
  }

  async findNotificationsByUserId(
    userId: number,
    limit: number
  ): Promise<schema.Notification[]> {
    const result = await db
      .select()
      .from(schema.notifications)
      .where(eq(schema.notifications.userId, userId))
      .orderBy(desc(schema.notifications.createdAt))
      .limit(limit);
    return result;
  }

  async createNotification(
    content: string,
    redirect: string,
    userId: number
  ): Promise<schema.Notification> {
    const [result] = await db
      .insert(schema.notifications)
      .values({ content, redirect, userId })
      .returning();
    return result;
  }

  async deleteNotificationById(id: number): Promise<schema.Notification> {
    const [result] = await db
      .delete(schema.notifications)
      .where(eq(schema.notifications.id, id))
      .returning();
    return result;
  }
}

export default new NotificationRepository();
