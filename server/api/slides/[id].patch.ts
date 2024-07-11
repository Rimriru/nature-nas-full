import { slides } from '~/server/models';
import type Slide from '~/types/SlideDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    try {
      const editedSlide = await slides.findByIdAndUpdate(id, body, { new: true });
      return editedSlide as unknown as Slide;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
