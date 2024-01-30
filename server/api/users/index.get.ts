import { users } from '../../models/index';

export default defineEventHandler(async (evt) => {
  console.log("GET /api/users");
  try {
    console.log("Find users");
    const usersData = await users.find();
    return usersData;
  } catch (error: any) {
    console.dir(error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    });
  }
});