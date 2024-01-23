import fs from 'fs';

import dotenv from 'dotenv';

import logger from '@utils/logger';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
} else {
  logger.debug(
    'Using .env.example file to supply config environment variables'
  );
  dotenv.config({ path: '.env.example' });
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production';

if (prod && process.env.POSTGRES_URL == null) {
  logger.error(
    'No postgres connection string. Set POSTGRES_URL environment variable.'
  );
  process.exit(1);
} else if (!prod && process.env.POSTGRES_URL_LOCAL == null) {
  logger.error(
    'No postgres connection string. Set POSTGRES_URL_LOCAL environment variable.'
  );
  process.exit(1);
}

export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const POSTGRES_URL = prod
  ? process.env.POSTGRES_URL!
  : process.env.POSTGRES_URL_LOCAL!;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
