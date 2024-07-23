import { slides } from '~/server/models';
import type Slide from '~/types/SlideDataFromDb';

export default defineEventHandler(async (event) => {
  try {
    const allSlides = await slides.find();
    return allSlides as unknown as Slide[];
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
