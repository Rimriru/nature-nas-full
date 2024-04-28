import { slides } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const allSlides = await slides.find();
    return allSlides;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
