import { groups } from '../../models/index';
import type { LinkGroup } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const groupData = await readBody(event);
  try {
    const editedGroup: LinkGroup | null = await groups.findByIdAndUpdate(id, groupData, {
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
