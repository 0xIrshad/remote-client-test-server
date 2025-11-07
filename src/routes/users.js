import { Router } from 'express';

const router = Router();

const users = new Map([
    ['1', { id: '1', name: 'Ada Lovelace', email: 'ada@example.com' }],
    ['2', { id: '2', name: 'Grace Hopper', email: 'grace@example.com' }],
]);

router.get('/users', async (req, res) => {
    const delay = Number.parseInt(req.query.delay, 10);
    if (!Number.isNaN(delay) && delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, Math.min(delay, 15000)));
    }

    res.json({
        success: true,
        data: Array.from(users.values()),
        message: 'Fetched users',
        meta: {
            total: users.size,
            tookMs: delay ? Math.min(delay, 15000) : 0,
        },
    });
});

router.get('/users/:id', (req, res) => {
    const user = users.get(req.params.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            data: null,
            message: `User ${req.params.id} not found`,
            error: {
                code: 'USER_NOT_FOUND',
                statusCode: 404,
            },
        });
    }

    return res.json({
        success: true,
        data: user,
        message: 'User fetched',
    });
});

router.post('/users', (req, res) => {
    const { name, email } = req.body ?? {};
    if (!name || !email) {
        return res.status(400).json({
            success: false,
            data: null,
            message: 'Invalid payload',
            error: {
                code: 'VALIDATION_ERROR',
                details: ['name and email are required'],
            },
        });
    }

    const id = (users.size + 1).toString();
    const user = { id, name, email };
    users.set(id, user);

    return res.status(201).json({
        success: true,
        data: user,
        message: 'User created',
    });
});

router.delete('/users/:id', (req, res) => {
    if (!users.has(req.params.id)) {
        return res.status(404).json({
            success: false,
            data: null,
            message: `User ${req.params.id} not found`,
        });
    }

    users.delete(req.params.id);
    return res.status(204).send();
});

export default router;

