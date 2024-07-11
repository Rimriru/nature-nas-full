import { conferences } from '~/server/models';
import auth from '~/server/utils/auth';
import type { ConfDataFromDb } from '~/types/ConfsDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    try {
      const editedConf = await conferences.findByIdAndUpdate(id, body, { new: true });
      return editedConf as unknown as ConfDataFromDb;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
