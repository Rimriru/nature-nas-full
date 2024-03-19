import { routes, links, contents } from '../../models/index';

export default defineEventHandler(async (evt) => {
  const id = getRouterParam(evt, 'id');
  try {
    const deletedRoute = await routes.findByIdAndDelete(id);
    if (deletedRoute) {
      await links.deleteMany({ route: deletedRoute });
      await contents.deleteOne({ route: deletedRoute });
    }
    return { deletedRoute, message: `Страница с ссылками удалена` };
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
