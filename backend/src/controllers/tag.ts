import { type RequestHandler } from 'express';
import { matchedData, query, validationResult } from 'express-validator';

import tagRepository from '@repositories/tag';

class TagController {
  getTags: RequestHandler = async (req, res, next) => {
    await query('offset', '올바르지 않은 오프셋입니다.')
      .optional()
      .default(0)
      .isInt()
      .toInt()
      .run(req);
    await query('name', '올바르지 않은 이름입니다.')
      .optional()
      .isString()
      .run(req);
    await query('type', '올바르지 않은 타입입니다.')
      .optional()
      .isInt()
      .toInt()
      .run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const data = matchedData(req);

    try {
      const count = await tagRepository.countTags(
        data.name as string | undefined,
        data.type as number | undefined
      );
      const tags = await tagRepository.searchTags(
        10,
        data.offset as number,
        data.name as string | undefined,
        data.type as number | undefined
      );
      res.status(200).json({ count, tags });
    } catch (error) {
      next(error);
    }
  };
}

export default new TagController();
