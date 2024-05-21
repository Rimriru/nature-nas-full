import { personas } from '~/server/models';

export default defineEventHandler(async (event) => {
  const personasId = getRouterParam(event, 'id');

  try {
    await personas.findByIdAndDelete(personasId);
    return { message: 'Контакт удалён успешно' };
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
