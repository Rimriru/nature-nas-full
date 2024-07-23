import { routes } from '~/server/models/index';
import type { RouteDataFromDb } from '~/types/RouteDataFromDb';

export default defineEventHandler(async () => {
  try {
    const allCustomRoutes: RouteDataFromDb[] = await routes.find();
    return allCustomRoutes;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
