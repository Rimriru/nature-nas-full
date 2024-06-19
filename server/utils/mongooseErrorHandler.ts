import { Error } from 'mongoose';

export const mongooseErrorHandler = (error: any) => {
  if (error instanceof Error.ValidationError || error instanceof Error.CastError) {
    throw createError({
      status: 400,
      message: error.message
    });
  }
};
