import { monographs } from '~/server/models';
import type { IMonographFromDb } from '~/types/MgraphsDataFromDb';

export default defineEventHandler(async (event) => {
  try {
    const allMonographs: IMonographFromDb[] | [] = await monographs.find({});
    return allMonographs;
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
