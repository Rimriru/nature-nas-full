import { sections } from '~/server/models';
import { SectionFromDb } from '~/types/SectionDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const newSectionBody = await readBody(event);

    try {
      const newSection = await sections.create(newSectionBody);
      setResponseStatus(event, 201);
      return {
        message: 'Новый раздел успешно создан!',
        newSection: newSection as unknown as SectionFromDb
      };
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
