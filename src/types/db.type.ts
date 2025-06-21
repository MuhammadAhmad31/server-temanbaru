import type { D1Database } from '@cloudflare/workers-types';

export interface Env {
  JWT_SECRET: string;
  PETFINDER_CLIENT_ID: string;
  PETFINDER_CLIENT_SECRET: string;
  DB: D1Database;
}