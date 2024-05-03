import { routes } from '../../models/index';
import { CONFLICT_ROUTE_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';
import type RouteDataFromDb from '~/types/RouteDataFromDb';

export default defineEventHandler(async (evt) => {
  const routeData = await readBody(evt);
  const jwt = getCookie(evt, 'jwt');

  try {
    if (jwt) {
      const newRoute = await routes.create(routeData);
      setResponseStatus(evt, 201);
      return newRoute as unknown as RouteDataFromDb;
    } else {
      throw createError({
        status: 401,
        message: UNAUTHORIZED_ERROR_MESSAGE
      });
    }
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
});
