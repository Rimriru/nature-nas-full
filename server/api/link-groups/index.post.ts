import { linkGroups } from '../../models/index';

export default defineEventHandler(async (evt) => {
  const newGroupTitle = await readBody(evt);
  try {
    const newGroup = await linkGroups.create(newGroupTitle);
    setResponseStatus(evt, 201);
    return newGroup;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
