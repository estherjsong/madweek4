import bodyParser from 'body-parser';
import compression from 'compression';
import express, { type Request, type Response } from 'express';

const app = express();

app.set('port', process.env.PORT ?? 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

export default app;
