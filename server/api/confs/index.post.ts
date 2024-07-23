import { conferences } from '~/server/models';
import auth from '~/server/utils/auth';
import type { ConfDataFromDb } from '~/types/ConfsDataFromDb';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const body = await readBody(event);
    try {
      const newConf: any = await conferences.create(body);
      setResponseStatus(event, 201);
      return newConf as unknown as ConfDataFromDb;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
