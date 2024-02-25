import { links, routes } from '../../models/index';
import { notFoundRouteErrorMesssage } from '~/utils/errorMessages';

interface RequestBody {
  title: string;
  to: string;
  group: string;
  createdByAdmin: Boolean;
}

export default defineEventHandler(async (evt) => {
  console.log('POST /api/links');
  const { title, to, group, createdByAdmin } = await readBody<RequestBody>(evt);
  try {
    const route = await routes.findOne({ path: to });
    if (!route) {
      throw createError({
        status: 404,
        statusMessage: notFoundRouteErrorMesssage
      });
    }

    const newLink = await links.create({
      title,
      group,
      to,
      createdByAdmin,
      route
    });
    setResponseStatus(evt, 201);

    return newLink;
  } catch (error: any) {
    console.error(error);
    throw createError({
      status: error.statusCode,
      statusMessage: error.message
    });
  }
});
