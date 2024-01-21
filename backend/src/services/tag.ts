import tagRepository from '@repositories/tag';
import { type Tag } from '@src/schema';

class TagService {
  async getTagsByBodyData(
    data: Array<{ id: number } | { name: string; type: number }>
  ): Promise<Tag[]> {
    const tags = await Promise.all(
      data
        .filter((tag, index) => {
          if ('id' in tag) {
            return (
              data.findIndex((e) => 'id' in e && tag.id === e.id) === index
            );
          }
          return (
            data.findIndex((e) => 'name' in e && tag.name === e.name) === index
          );
        })
        .map(async (tag) => {
          if ('id' in tag) {
            return await tagRepository.findTagById(tag.id);
          }
          return (
            (await tagRepository.findTagByName(tag.name)) ??
            (await tagRepository.createTag(tag.name, tag.type))
          );
        })
    );

    return tags
      .filter((tag, index) => tags.findIndex((e) => e.id === tag.id) === index)
      .sort((a, b) => a.id - b.id);
  }
}

export default new TagService();
