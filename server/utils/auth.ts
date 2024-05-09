import { FORBIDDEN_ERROR_MESSAGE } from '~/utils/errorMessages';

export default defineEventHandler((event) => {
  const jwt = getCookie(event, 'jwt');

  if (!jwt) {
    throw createError({
      status: 403,
      message: FORBIDDEN_ERROR_MESSAGE,
      statusText: 'Forbidden'
    });
  }
});
