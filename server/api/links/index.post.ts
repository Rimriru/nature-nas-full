import { links, routes } from '../../models/index';
import { NOT_FOUND_ERROR_MESSAGE } from '~/utils/errorMessages';
import type { NewLinkRequestBody } from './types/links';

export default defineEventHandler(async (evt) => {
  console.log('POST /api/links');
  const { title, to, group } = await readBody<NewLinkRequestBody>(evt);
  try {
    const route = await routes.findOne({ path: to });
    if (!route) {
      throw createError({
        status: 404,
        message: NOT_FOUND_ERROR_MESSAGE
      });
    }

    const newLink = await links.create({
      title,
      group,
      to,
      route
    });
    setResponseStatus(evt, 201);

    return newLink;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
