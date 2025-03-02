import { promises as fs } from 'fs';

export default defineEventHandler({
  handler: async (event) => {
    const body = await readBody<[]>(event);

    try {
      if (body.length) {
        body.forEach(async (image: string) => {
          await fs.unlink(`.output/public/assets/images/${image}`);
        });
      }
      return { message: 'Images are removed' };
    } catch (error: any) {
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
