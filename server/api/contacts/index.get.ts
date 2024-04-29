import { contacts } from '~/server/models';

export default defineEventHandler(async (event) => {
  try {
    const contactData = await contacts.findOne();
    return contactData;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
