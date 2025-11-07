import { Router } from 'express';

const router = Router();

const VALID_API_KEY = 'super-secret';
const ISSUED_TOKENS = new Set();

router.post('/auth/login', (req, res) => {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            data: null,
            message: 'Missing credentials',
        });
    }

    const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    ISSUED_TOKENS.add(token);

    return res.json({
        success: true,
        data: {
            token,
            expiresIn: 3600,
        },
        message: 'Login successful',
    });
});

router.post('/auth/logout', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || !ISSUED_TOKENS.has(token)) {
        return res.status(401).json({
            success: false,
            data: null,
            message: 'Invalid token',
        });
    }

    ISSUED_TOKENS.delete(token);
    return res.status(204).send();
});

router.get('/auth/protected', (req, res) => {
    const authHeader = req.headers.authorization;
    const apiKey = req.headers['x-api-key'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            data: null,
            message: 'Missing bearer token',
        });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!ISSUED_TOKENS.has(token)) {
        return res.status(401).json({
            success: false,
            data: null,
            message: 'Token expired or invalid',
        });
    }

    if (apiKey !== VALID_API_KEY) {
        return res.status(403).json({
            success: false,
            data: null,
            message: 'Missing or invalid API key',
        });
    }

    return res.json({
        success: true,
        data: {
            secret: '42',
            issuedAt: Date.now(),
        },
        message: 'Protected resource',
    });
});

export default router;

