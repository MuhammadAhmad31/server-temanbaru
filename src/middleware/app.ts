import { Next } from 'hono';
import { AppFactory } from '../factory/app.factory';
import { AppContext } from '../types/app.type';
import { Env } from '../types/db.type';

export async function appMiddleware(c: AppContext, next: Next): Promise<void> {
  c.set('controllers', AppFactory.getControllers(c.env.DB, c.env as Env));
  await next();
}