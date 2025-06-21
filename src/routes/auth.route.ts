import { Hono } from "hono";
import { AppContext } from '../types/app.type';

const auth = new Hono<{
  Bindings: AppContext['env'];
  Variables: AppContext['var'];
}>();

auth.post('/login', async (c: AppContext) => {
  const { auth } = c.var.controllers;
  return await auth.login(c);
});

auth.post('/register', async (c: AppContext) => {
  const { auth } = c.var.controllers;
  return await auth.register(c);
});

export { auth };