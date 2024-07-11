import { groups, links } from '~/server/models/index';
import type { LinkGroup } from '~/types/LinkDataFromDb';

export default defineEventHandler(async (evt) => {
  const _ = [groups.length, links.length];
  try {
    const allLinkGroups = await groups.find({}).populate('links');
    return allLinkGroups as unknown as LinkGroup[];
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
