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

if (process.env.POSTGRES_URL === undefined) {
  logger.error(
    'No postgres connection string. Set POSTGRES_URL environment variable.'
  );
  process.exit(1);
}

if (process.env.SESSION_SECRET === undefined) {
  logger.error(
    'No session secret string. Set SESSION_SECRET environment variable.'
  );
  process.exit(1);
}

if (process.env.OPENAI_API_KEY === undefined) {
  logger.error(
    'No OpenAI API key string. Set OPENAI_API_KEY environment variable.'
  );
  process.exit(1);
}

export const ENVIRONMENT = process.env.NODE_ENV;
export const POSTGRES_URL = process.env.POSTGRES_URL;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
