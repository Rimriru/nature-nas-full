export default defineEventHandler(async (evt) => {
  try {
    deleteCookie(evt, 'jwt', {
      maxAge: 3600000 * 24,
      httpOnly: true,
      sameSite: true
    });
    return { message: 'Вы успешно вышли из системы!' };
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
