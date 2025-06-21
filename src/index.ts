import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { AppContext } from './types/app.type';
import { appMiddleware } from './middleware/app';
import { users } from './routes/user.route';
import { auth } from './routes/auth.route';
import { pets } from './routes/pet.route';
import { ApiResponse } from './types/responseApi.type';
import { adoption } from './routes/adoption.routes';

const app = new Hono<{
  Bindings: AppContext['env'];
  Variables: AppContext['var'];
}>();

app.use('*', logger());
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', appMiddleware);

app.get('/', (c: AppContext) => {
  return c.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

app.route('/api/users', users);
app.route('/api/auth', auth);
app.route('/api/pets', pets);
app.route('/api/adoption', adoption);

app.notFound((c) => {
  const response: ApiResponse = {
    success: false,
    error: 'Route not found'
  };
  return c.json(response, 404);
});

// Global error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  
  const response: ApiResponse = {
    success: false,
    error: 'Internal server error'
  };
  
  return c.json(response, 500);
});

export default app;