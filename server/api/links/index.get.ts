import { links } from '../../models/index';

export default defineEventHandler(async (evt) => {
  console.log('GET /api/links');
  try {
    const linksData = links.find();
    return linksData;
  } catch (error: any) {
    console.error(error);
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
