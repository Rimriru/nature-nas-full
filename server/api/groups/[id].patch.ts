import { groups } from '../../models/index';
import { UNAUTHORIZED_ERROR_MESSAGE } from '~/utils/errorMessages';
import type { LinkGroup } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const groupData = await readBody(event);
  const jwt = getCookie(event, 'jwt');

  try {
    if (jwt) {
      const editedGroup: LinkGroup | null = await groups.findByIdAndUpdate(id, groupData, {
        new: true
      });
      return editedGroup;
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
