import { contacts } from '~/server/models';
import type { ContactsDataFromDb } from '~/types/ContactsDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    try {
      const editedContactsData = await contacts.findByIdAndUpdate(id, body, { new: true });
      return editedContactsData as unknown as ContactsDataFromDb;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
