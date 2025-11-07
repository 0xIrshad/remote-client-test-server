import { Router } from 'express';

const router = Router();

router.get('/errors/bad-request', (_req, res) => {
    res.status(400).json({
        success: false,
        data: null,
        message: 'Bad request example',
        error: {
            code: 'BAD_REQUEST',
            details: ['Example of a malformed request scenario'],
        },
    });
});

router.get('/errors/unauthorized', (_req, res) => {
    res.status(401).json({
        success: false,
        data: null,
        message: 'Unauthorized example',
        error: {
            code: 'UNAUTHORIZED',
            details: ['Token expired or missing'],
        },
    });
});

router.get('/errors/forbidden', (_req, res) => {
    res.status(403).json({
        success: false,
        data: null,
        message: 'Forbidden example',
        error: {
            code: 'FORBIDDEN',
        },
    });
});

router.get('/errors/not-found', (_req, res) => {
    res.status(404).json({
        success: false,
        data: null,
        message: 'Resource not found',
        error: {
            code: 'NOT_FOUND',
        },
    });
});

router.get('/errors/server', (_req, res) => {
    res.status(500).json({
        success: false,
        data: null,
        message: 'Internal server error',
        error: {
            code: 'INTERNAL_SERVER_ERROR',
        },
    });
});

router.get('/errors/unavailable', (_req, res) => {
    res.status(503).json({
        success: false,
        data: null,
        message: 'Service unavailable',
        error: {
            code: 'SERVICE_UNAVAILABLE',
        },
    });
});

router.get('/errors/gateway-timeout', (_req, res) => {
    res.status(504).json({
        success: false,
        data: null,
        message: 'Gateway timeout',
        error: {
            code: 'GATEWAY_TIMEOUT',
        },
    });
});

router.get('/errors/timeout', async (req, res) => {
    const delayMs = Number.parseInt(req.query.delay ?? '8000', 10);
    await new Promise((resolve) => setTimeout(resolve, Number.isNaN(delayMs) ? 8000 : delayMs));
    res.status(504).json({
        success: false,
        data: null,
        message: 'Simulated timeout after delayed response',
        error: {
            code: 'SIMULATED_TIMEOUT',
            delayMs,
        },
    });
});

router.get('/errors/bad-response', (_req, res) => {
    res.status(200)
        .type('application/json')
        .send('this is not valid json');
});

router.get('/errors/slow-stream', async (_req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const chunks = ['Chunk 1\n', 'Chunk 2\n', 'Chunk 3\n'];

    for (const chunk of chunks) {
        res.write(chunk);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    res.end('Done\n');
});

export default router;

