import { users } from "~/server/models";

export default defineEventHandler(async (evt) => {
  const id = evt.context.params;
  console.log(`It's GET on /api/users/${id}`);

  try {
    const userData = await users.findById(id);
    if (userData) {
      console.log('Found it!');
      return userData;
    } else {
      console.log('Not found!');
      return { code: "USER_NOT_FOUND",
      message: `User with id ${id} doesn't exists.`,}
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }
})