import { sections } from '../../models/index';
import { SectionFromDb } from '~/types/SectionDataFromDb';

export default defineEventHandler(async (event) => {
  const newSectionBody = await readBody(event);
  try {
    const newSection = await sections.create(newSectionBody);
    setResponseStatus(event, 201);
    return {
      message: 'Новый раздел успешно создан!',
      newSection: newSection as unknown as SectionFromDb
    };
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
