import { news } from '~/server/models';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  try {
    const createdNewsItem = await news.create(body);
    setResponseStatus(event, 201);
    return createdNewsItem;
  } catch (error: any) {
    return createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
