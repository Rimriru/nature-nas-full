import { routes } from '../../models/index';

export default defineEventHandler(async (evt) => {
  console.log('DELETE /api/routes');
  const id = getRouterParam(evt, 'id');
  try {
    console.log('Delete route');
    const deletedRoute = await routes.findByIdAndDelete(id);
    return { message: 'Страница удалена' };
  } catch (error: any) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }
});
