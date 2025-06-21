import type { D1Database } from '@cloudflare/workers-types';

export interface Env {
  JWT_SECRET: string;
  DB: D1Database;
}