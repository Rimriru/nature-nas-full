import { news } from '~/server/models';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  try {
    await news.findByIdAndDelete(id);
    return { message: 'Новость удалена' };
  } catch (error: any) {
    return createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
