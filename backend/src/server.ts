import errorHandler from 'errorhandler';

import app from '@src/app';
import logger from '@utils/logger';
import { ENVIRONMENT } from '@utils/secret';

if (ENVIRONMENT !== 'production') {
  app.use(
    errorHandler({
      log: (error) =>
        logger.error(
          `${error.message}\n${error.stack?.split('\n').slice(1).join('\n')}`
        ),
    })
  );
}

const server = app.listen(app.get('port'), () => {
  logger.info(
    `App is running at http://localhost:${app.get('port')} in ${app.get('env')} mode`
  );
  logger.info('Press CTRL-C to stop\n');
});

export default server;
