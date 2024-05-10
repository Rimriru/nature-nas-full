import { promises as fs } from 'fs';

export default defineEventHandler({
  handler: async (event) => {
    const name = getRouterParam(event, 'name');

    try {
      await fs.unlink(`public/docs/${name}`);
      return { message: 'File is removed' };
    } catch (error: any) {
      return createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
