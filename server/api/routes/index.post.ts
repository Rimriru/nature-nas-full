import { routes } from '../../models/index';
import { CONFLICT_ROUTE_ERROR_MESSAGE } from '~/utils/errorMessages';

export default defineEventHandler(async (evt) => {
  console.log('POST /api/routes');
  const routeData = await readBody(evt);
  try {
    console.log('Creating new route in DB');
    const newRoute = await routes.create(routeData);
    setResponseStatus(evt, 201);
    return newRoute;
  } catch (error: any) {
    if (error.code === 11000) {
      throw createError({
        statusCode: 409,
        statusText: CONFLICT_ROUTE_ERROR_MESSAGE
      });
    } else {
      console.dir(error);
      throw createError({
        status: error.statusCode,
        statusText: error.message
      });
    }
  }
});
