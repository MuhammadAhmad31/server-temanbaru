import { Context as HonoContext } from 'hono';
import { Env } from './db.type';
import { UserController } from '../controllers/user.controller';

export interface Controllers {
  user: UserController;
  // product: ProductController;
  // order: OrderController;
}

export interface AppVariables {
  controllers: Controllers;
}

export type AppContext = HonoContext<{
  Bindings: Env;
  Variables: AppVariables;
}>;