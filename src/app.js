import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import healthRouter from './routes/health.js';
import usersRouter from './routes/users.js';
import errorsRouter from './routes/errors.js';
import authRouter from './routes/auth.js';
import retryRouter from './routes/retry.js';
import filesRouter from './routes/files.js';
import utilitiesRouter from './routes/utilities.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', healthRouter);
app.use('/api', usersRouter);
app.use('/api', errorsRouter);
app.use('/api', authRouter);
app.use('/api', retryRouter);
app.use('/api', filesRouter);
app.use('/api', utilitiesRouter);

app.use('/api/config', (_req, res) => {
    res.json({
        success: true,
        data: {
            environment: process.env.NODE_ENV ?? 'development',
            uptime: process.uptime(),
        },
        message: 'Configuration info',
    });
});

app.use('*', (_req, res) => {
    res.status(404).json({
        success: false,
        data: null,
        message: 'Route not found',
    });
});

export default app;

