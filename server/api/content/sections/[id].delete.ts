import { contents } from '~/server/models/index';
import { BAD_REQUEST_ERROR_MESSAGE } from '~/utils/errorMessages';

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const contentId = getRouterParam(event, 'id');
    const { sectionId } = await readBody(event);

    if (!contentId || !sectionId) {
      throw createError({
        status: 400,
        message: BAD_REQUEST_ERROR_MESSAGE
      });
    }

    try {
      const newContent = await contents.findByIdAndUpdate(
        contentId,
        { $pull: { sections: sectionId } },
        { new: true }
      );
      return newContent;
    } catch (error: any) {
      mongooseErrorHandler(error);
      throw createError({
        status: error.statusCode,
        message: error.message
      });
    }
  }
});
