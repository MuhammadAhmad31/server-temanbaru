import { MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';
import type { Env } from '../types/db.type';

export const authMiddlewareAdmin: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized: No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = c.env.JWT_SECRET;
    const decoded = await verify(token, secret) as { email: string };

    if (decoded.email !== 'admin@mail.com') {
      return c.json({ success: false, error: 'Forbidden: Admins only' }, 403);
    }

    c.set('jwtPayload', decoded);
    await next();
  } catch (error) {
    return c.json({ success: false, error: 'Unauthorized: Invalid token' }, 401);
  }
};


export const authMiddlewareUser: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: 'Unauthorized: No token provided' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = (c.env as Env).JWT_SECRET;
    const decoded = await verify(token, secret);

    c.set('jwtPayload', decoded as { email: string });
    await next();
  } catch (error) {
    return c.json({ success: false, error: 'Unauthorized: Invalid token' }, 401);
  }
};
