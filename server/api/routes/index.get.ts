import { routes } from '../../models/index';

export default defineEventHandler(async () => {
  console.log('GET /api/routes');

  try {
    console.log('Find routes');
    const allCustomRoutes = await routes.find();
    return allCustomRoutes;
  } catch (error: any) {
    console.dir(error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }
});
