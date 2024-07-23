import { sections } from '~/server/models';
import { BAD_REQUEST_ERROR_MESSAGE } from '~/utils/errorMessages';
import type { SectionFromDb } from '~/types/SectionDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    const sectionBody = await readBody(event);

    if (!id || !sectionBody) {
      throw createError({
        status: 400,
        message: BAD_REQUEST_ERROR_MESSAGE
      });
    }

    try {
      const updatedSection = await sections.findByIdAndUpdate(id, sectionBody, {
        new: true
      });
      const message = `Раздел "${sectionBody.title}" был изменён`;
      return { message, updatedSection: updatedSection as unknown as SectionFromDb };
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
