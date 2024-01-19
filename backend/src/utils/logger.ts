import winston, { format } from 'winston';

const options: winston.LoggerOptions = {
  format: format.combine(format.colorize(), format.simple()),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
  ],
};

const logger = winston.createLogger(options);

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level');
}

export default logger;
