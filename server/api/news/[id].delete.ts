import { news } from '~/server/models';
import { UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';
import { IMAGE_LINK_REG_EXP } from '~/utils/regExp';
import type { NewsDataFromDb } from '~/types/NewsDataFromDb';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const jwt = getCookie(event, 'jwt');

  try {
    if (jwt) {
      const newsItem: NewsDataFromDb | null = await news.findById(id);
      if (newsItem && !IMAGE_LINK_REG_EXP.test(newsItem.cover)) {
        await $fetch(`/api/images/${newsItem.cover}`, {
          method: 'delete'
        });
      }
      await news.findByIdAndDelete(id);
      return { message: 'Новость удалена' };
    } else {
      throw createError({
        status: 401,
        message: UNAUTHORIZED_ERROR_MESSAGE
      });
    }
  } catch (error: any) {
    return createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
