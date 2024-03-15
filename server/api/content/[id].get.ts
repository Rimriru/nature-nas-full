import { contents } from '../../models/index';

export default defineEventHandler(async (evt) => {
  const id = getRouterParam(evt, 'id');
  try {
    const content = await contents.findOne({ route: { _id: id } });
    return content;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
