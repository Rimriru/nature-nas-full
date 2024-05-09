import jwt from 'jsonwebtoken';
import { users } from '~/server/models';

interface RequestBody {
  username: string;
  password: string;
}

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody<RequestBody>(event);
  const config = useRuntimeConfig();

  try {
    const user = await users.findOne({ username });
    if (!user) {
      throw createError({
        status: 401,
        message: 'Вы ввели неверный логин или пароль'
      });
    }
    const isPasswordValid = user.verifyPasswordSync(password);
    if (!isPasswordValid) {
      throw createError({
        status: 401,
        statusText: 'Unauthorized',
        message: 'Вы ввели неверный логин или пароль'
      });
    } else {
      const token = jwt.sign(
        { _id: user._id },
        `${config.public.process === 'production' ? config.apiSecret : 'super-secret-haha'}`,
        { expiresIn: '1d' }
      );
      setCookie(event, 'jwt', token, {
        maxAge: 3600000 * 24,
        httpOnly: true,
        sameSite: true
      });
      return { message: 'Вы успешно вошли в систему!' };
    }
  } catch (error: any) {
    throw createError({
      status: error.statusCode,
      message: error.message
    });
  }
});
