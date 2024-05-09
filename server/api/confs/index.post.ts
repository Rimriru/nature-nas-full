import { conferences } from '~/server/models';
import auth from '~/server/utils/auth';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const body = await readBody(event);
    try {
      const editedConf = await conferences.create(body);
      setResponseStatus(event, 201);
      return editedConf;
    } catch (error: any) {
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
