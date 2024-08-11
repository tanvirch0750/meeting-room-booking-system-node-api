import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors({ origin: ['http://localhost:3000'] })); // frontend origin
app.use(cookieParser());

// application routes
app.use('/api/v1', router);

// response to root route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to meet and greet place');
});

//Not Found
app.all('*', notFound);

// gloabla error handeling
app.use(globalErrorHandler);

export default app;
