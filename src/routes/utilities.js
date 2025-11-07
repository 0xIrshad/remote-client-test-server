import { Router } from 'express';

const router = Router();

router.post('/transform/echo', (req, res) => {
    res.json({
        success: true,
        data: req.body ?? {},
        message: 'Echo payload',
    });
});

router.post('/transform/enrich', (req, res) => {
    res.json({
        success: true,
        data: {
            original: req.body ?? {},
            enrichedAt: new Date().toISOString(),
            server: 'remote-client-test-server',
        },
        message: 'Payload enriched',
    });
});

router.get('/meta/paginated', (req, res) => {
    const page = Number.parseInt(req.query.page ?? '1', 10);
    const limit = Number.parseInt(req.query.limit ?? '10', 10);
    const total = 53;
    const totalPages = Math.ceil(total / limit);

    const results = Array.from({ length: limit }, (_, idx) => ({
        id: (page - 1) * limit + idx + 1,
        value: `Item ${(page - 1) * limit + idx + 1}`,
    })).filter((item) => item.id <= total);

    res.json({
        success: true,
        data: results,
        message: 'Paginated data',
        meta: {
            page,
            limit,
            total,
            totalPages,
        },
    });
});

router.get('/headers/inspect', (req, res) => {
    res.json({
        success: true,
        data: {
            headers: req.headers,
        },
        message: 'Headers received',
    });
});

export default router;

