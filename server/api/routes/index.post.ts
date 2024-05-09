import { routes } from '../../models/index';
import { CONFLICT_ROUTE_ERROR_MESSAGE } from '~/utils/errorMessages';
import type RouteDataFromDb from '~/types/RouteDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (evt) => {
    const routeData = await readBody(evt);

    try {
      const newRoute = await routes.create(routeData);
      setResponseStatus(evt, 201);
      return newRoute as unknown as RouteDataFromDb;
    } catch (error: any) {
      if (error.code === 11000) {
        throw createError({
          statusCode: 409,
          message: CONFLICT_ROUTE_ERROR_MESSAGE
        });
      } else {
        console.dir(error);
        throw createError({
          status: error.statusCode,
          message: error.message
        });
      }
    }
  }
});
