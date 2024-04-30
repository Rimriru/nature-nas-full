import { contacts } from '~/server/models';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  try {
    const editedContactsData = await contacts.findByIdAndUpdate(id, body, { new: true });
    return editedContactsData;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
