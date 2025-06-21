import { Hono } from 'hono';
import { AppContext } from '../types/app.type';
import { authMiddlewareAdmin } from '../middleware/auth';

const users = new Hono<{
  Bindings: AppContext['env'];
  Variables: AppContext['var'];
}>();

users.use('*', authMiddlewareAdmin); 

users.get('/', async (c: AppContext) => {
  const { user } = c.var.controllers;
  return await user.getAllUsers(c);
});

users.get('/:id', async (c: AppContext) => {
  const { user } = c.var.controllers;
  return await user.getUserById(c);
});

users.post('/', async (c: AppContext) => {
  const { user } = c.var.controllers;
  return await user.createUser(c);
});

users.put('/:id', async (c: AppContext) => {
  const { user } = c.var.controllers;
  return await user.updateUser(c);
});

users.delete('/:id', async (c: AppContext) => {
  const { user } = c.var.controllers;
  return await user.deleteUser(c);
});

export { users };