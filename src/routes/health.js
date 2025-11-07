import { Router } from 'express';

const router = Router();

router.get('/health', (_req, res) => {
    res.json({
        success: true,
        data: {
            status: 'ok',
            timestamp: Date.now(),
        },
        message: 'Service is healthy',
    });
});

router.get('/status', (_req, res) => {
    res.json({
        success: true,
        data: {
            uptime: process.uptime(),
            pid: process.pid,
            memory: process.memoryUsage(),
        },
        message: 'Detailed status',
    });
});

export default router;

