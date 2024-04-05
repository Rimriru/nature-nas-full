import mongoose from 'mongoose';
import { linkGroups, links } from '~/server/models';
import type { LinkGroup } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (event) => {
  const groupId = getRouterParam(event, 'id');
  const session = await mongoose.startSession();
  try {
    const result = session.withTransaction(async () => {
      const deletedGroup = await linkGroups.findByIdAndDelete(groupId);
      const deletedGroupTyped = deletedGroup as unknown as LinkGroup;
      const deletedLinks = await links.deleteMany({ _id: { $in: deletedGroupTyped.links } });
      return { message: 'Группа ссылок удалена', deletedLinks, deletedGroup };
    });
    return result;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  } finally {
    session.endSession();
  }
});
