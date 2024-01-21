import compression from 'compression';
import connectPgSimple from 'connect-pg-simple';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import questionRoute from '@routes/question';
import userRoute from '@routes/user';
import logger from '@utils/logger';
import { ENVIRONMENT, POSTGRES_URL, SESSION_SECRET } from '@utils/secret';

const app = express();

const PostgresqlStore = connectPgSimple(session);
const sess: session.SessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {},
  store: new PostgresqlStore({
    conString: POSTGRES_URL,
    createTableIfMissing: true,
  }),
};

if (ENVIRONMENT === 'production') {
  app.set('trust proxy', 1);
  sess.cookie!.sameSite = 'none';
  sess.cookie!.secure = true;
}

app.set('port', process.argv[2] ?? 80);

app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(
    swaggerJsdoc({
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Madcamp Week4',
          version: '1.0.0',
        },
      },
      apis: ['./src/routes/*.ts'],
    })
  )
);

app.use(helmet());
app.use(compression());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(ENVIRONMENT === 'production' ? 'combined' : 'dev', {
    stream: { write: (message) => logger.info(message.trim()) },
    skip: (_, res) => {
      if (ENVIRONMENT === 'production') {
        return res.statusCode < 400;
      }
      return false;
    },
  })
);
app.use(session(sess));
app.use(passport.authenticate('session'));

app.use('/', userRoute);
app.use('/question', questionRoute);

export default app;
