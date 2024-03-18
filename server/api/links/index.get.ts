import { Link } from '~/types/LinkDataFromDb';
import { links } from '../../models/index';

export default defineEventHandler(async (evt) => {
  try {
    const linksData = links.find();
    return linksData as unknown as Link[];
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
