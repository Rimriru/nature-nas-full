import { contents } from '../../models/index';

export default defineEventHandler(async (event) => {
  const { contentId, sectionId } = getQuery(event);
  try {
    const newContent = await contents.findByIdAndUpdate(
      contentId,
      { $addToSet: { sections: sectionId } },
      { new: true }
    );
    return newContent;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
