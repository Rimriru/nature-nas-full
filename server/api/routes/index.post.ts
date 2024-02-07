import { routes } from '../../models/index';
import { conflictRouteErrorMessage } from '~/utils/errorMessages';

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
        statusMessage: conflictRouteErrorMessage
      });
    } else {
      console.dir(error);
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      });
    }
  }
});
