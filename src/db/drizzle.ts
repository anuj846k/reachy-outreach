import { config } from 'dotenv';
import { fromEnv } from '@aws-sdk/credential-providers';
import { Signer } from '@aws-sdk/rds-signer';
import postgres from 'postgres';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

config({ path: '.env' });

const endpoint = process.env.AURORA_ENDPOINT;
const region = process.env.AWS_REGION ?? 'ap-south-1';

if (!endpoint) {
  throw new Error('AURORA_ENDPOINT env var is required');
}

const signer = new Signer({
  hostname: endpoint,
  port: 5432,
  username: 'postgres',
  region,
  credentials: fromEnv(),
});

const sql = postgres({
  host: endpoint,
  port: 5432,
  database: 'reachy_outreach',
  username: 'postgres',
  password: () => signer.getAuthToken(),
  ssl: 'require',
  max_lifetime: 60 * 5,
  idle_timeout: 60 * 5,
  max: 5,
});

export const db = drizzlePg(sql, { schema });
