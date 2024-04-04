import { linkGroups } from '../../models/index';
import type { LinkGroup } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (evt) => {
  try {
    const allLinkGroups = linkGroups.find().populate('links');
    return allLinkGroups as unknown as LinkGroup[];
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
