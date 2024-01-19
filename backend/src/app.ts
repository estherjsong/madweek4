/* eslint-disable @typescript-eslint/no-misused-promises */
import { isAuthenticated } from '@config/passport';
import * as userController from '@controllers/user';
import compression from 'compression';
import connectPgSimple from 'connect-pg-simple';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';

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
  sess.cookie!.secure = true;
}

app.set('port', process.env.PORT ?? 3000);
app.use(helmet());
app.use(compression());
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

app.post('/login', userController.postLogin);
app.post('/logout', isAuthenticated, userController.postLogout);
app.post('/signup', userController.postSignup);

export default app;
