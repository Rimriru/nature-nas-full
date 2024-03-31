import { sections } from '../../models/index';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  try {
    await sections.findByIdAndDelete(id);
    return { message: 'Раздел удалён' };
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
