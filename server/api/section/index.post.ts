import { sections } from '../../models/index';
import { UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';
import { SectionFromDb } from '~/types/SectionDataFromDb';

export default defineEventHandler(async (event) => {
  const newSectionBody = await readBody(event);
  const jwt = getCookie(event, 'jwt');

  try {
    if (jwt) {
      const newSection = await sections.create(newSectionBody);
      setResponseStatus(event, 201);
      return {
        message: 'Новый раздел успешно создан!',
        newSection: newSection as unknown as SectionFromDb
      };
    } else {
      throw createError({
        status: 401,
        message: UNAUTHORIZED_ERROR_MESSAGE
      });
    }
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
