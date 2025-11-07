import { Router } from 'express';

const router = Router();

const retryState = {
    flaky: 0,
    rateLimited: 0,
};

router.get('/retry/flaky', (_req, res) => {
    retryState.flaky += 1;
    if (retryState.flaky % 3 !== 0) {
        return res.status(500).json({
            success: false,
            data: null,
            message: 'Flaky endpoint failed',
            retryCount: retryState.flaky,
        });
    }

    return res.json({
        success: true,
        data: {
            retries: retryState.flaky - 1,
        },
        message: 'Flaky endpoint succeeded',
    });
});

router.get('/retry/rate-limit', (_req, res) => {
    retryState.rateLimited += 1;
    if (retryState.rateLimited % 4 !== 0) {
        const resetSec = 5;
        res.setHeader('Retry-After', resetSec);
        return res.status(429).json({
            success: false,
            data: null,
            message: 'Too many requests, retry later',
            error: {
                code: 'RATE_LIMITED',
                retryAfterSeconds: resetSec,
            },
        });
    }

    return res.json({
        success: true,
        data: {
            message: 'Rate limit lifted',
        },
    });
});

router.get('/retry/reset', (_req, res) => {
    retryState.flaky = 0;
    retryState.rateLimited = 0;
    res.json({
        success: true,
        data: retryState,
        message: 'Retry counters reset',
    });
});

export default router;

