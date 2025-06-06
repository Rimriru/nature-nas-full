import { mongooseErrorHandler } from '~/server/utils/mongooseErrorHandler';
import { monographs } from '~/server/models';
import type { IMonographFromDb } from '~/types/MgraphsDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    try {
      const editedMonograph: any = await monographs.findByIdAndUpdate(id, body, { new: true });
      return editedMonograph as unknown as IMonographFromDb;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
