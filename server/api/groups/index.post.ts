import { groups } from '../../models/index';
import { UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';
import type { LinkGroup } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (evt) => {
  const newGroupData = await readBody(evt);
  const jwt = getCookie(evt, 'jwt');

  try {
    if (jwt) {
      const newGroup = await groups.create(newGroupData);
      setResponseStatus(evt, 201);
      return newGroup as unknown as LinkGroup;
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
