import { linkGroups } from '~/server/models';
import type { LinkGroup } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const groupData = await readBody(event);
  try {
    const editedGroup: LinkGroup | null = await linkGroups.findByIdAndUpdate(id, groupData, {
      new: true
    });
    return editedGroup;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
