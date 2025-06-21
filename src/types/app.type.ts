import { Context as HonoContext } from 'hono';
import { Env } from './db.type';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';

export interface Controllers {
  user: UserController;
  auth: AuthController;
  // product: ProductController;
  // order: OrderController;
}

export interface AppVariables {
  controllers: Controllers;
  jwtPayload?: {
    email: string;
  };
}

export type AppContext = HonoContext<{
  Bindings: Env;
  Variables: AppVariables;
}>;