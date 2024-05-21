import { news } from '~/server/models';
import { IMAGE_LINK_REG_EXP } from '~/utils/regExp';
import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');

    try {
      const newsItem: NewsDataFromDb | null = await news.findById(id);
      if (newsItem && !IMAGE_LINK_REG_EXP.test(newsItem.cover)) {
        await $fetch(`/api/images/${newsItem.cover}`, {
          method: 'delete'
        });
      }
      await news.findByIdAndDelete(id);
      return { message: 'Новость удалена' };
    } catch (error: any) {
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
