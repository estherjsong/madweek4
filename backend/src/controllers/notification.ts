import { type RequestHandler } from 'express';
import { matchedData, param, validationResult } from 'express-validator';

import notificationRepository from '@repositories/notification';
import { type User } from '@src/schema';

class NotificationController {
  getNotifications: RequestHandler = async (req, res, next) => {
    try {
      const user = req.user as User;
      const notifications =
        await notificationRepository.findNotificationsByUserId(user.id, 5);
      res.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  };

  deleteNotification: RequestHandler = async (req, res, next) => {
    await param('id', '올바르지 않은 알림입니다.')
      .isInt()
      .toInt()
      .custom(async (value: number) => {
        const notification =
          await notificationRepository.findNotificationById(value);
        if (notification == null) throw new Error();
        if (notification.userId !== (req.user as User).id) {
          throw new Error('본인의 알림이 아닙니다.');
        }
      })
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data: Record<string, number> = matchedData(req);

    try {
      const notification = await notificationRepository.deleteNotificationById(
        data.id
      );
      res.status(200).json(notification);
    } catch (error) {
      next(error);
    }
  };
}

export default new NotificationController();
