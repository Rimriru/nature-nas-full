import { users } from '~/server/models/index';

interface RequestBody {
  username: string;
  password: string;
}

export default defineEventHandler(async (evt) => {
  const { username, password } = await readBody<RequestBody>(evt);
  try {
    const newUserData = await users.create({
      password,
      username
    });
    return newUserData;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
