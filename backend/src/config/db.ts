import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import logger from '@utils/logger';
import { POSTGRES_URL } from '@utils/secret';

const migrationClient = postgres(POSTGRES_URL, {
  max: 1,
  onnotice: () => {},
});

void migrate(drizzle(migrationClient), { migrationsFolder: './drizzle' }).then(
  (_) => logger.debug('Database migration completed')
);

const queryClient = postgres(POSTGRES_URL);
logger.debug(`PostgreSQL opened on '${POSTGRES_URL}' connection string`);

export default drizzle(queryClient);
