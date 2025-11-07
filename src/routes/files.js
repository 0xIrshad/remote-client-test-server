import { Router } from 'express';
import multer from 'multer';
import { randomUUID } from 'crypto';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/files/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            data: null,
            message: 'Missing multipart file field "file"',
        });
    }

    const id = randomUUID();

    return res.status(201).json({
        success: true,
        data: {
            id,
            filename: req.file.originalname,
            size: req.file.size,
            mimeType: req.file.mimetype,
            description: req.body?.description ?? null,
        },
        message: 'File uploaded',
    });
});

router.post('/files/uploads', upload.array('files'), (req, res) => {
    const files = req.files ?? [];
    if (files.length === 0) {
        return res.status(400).json({
            success: false,
            data: null,
            message: 'No files provided',
        });
    }

    return res.status(201).json({
        success: true,
        data: files.map((file) => ({
            id: randomUUID(),
            filename: file.originalname,
            size: file.size,
            mimeType: file.mimetype,
        })),
        message: 'Files uploaded',
    });
});

router.get('/files/download', (_req, res) => {
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="example.txt"');
    res.send('Hello from the remote client sample server!\n');
});

router.get('/files/stream', async (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.write('[');
    for (let i = 0; i < 5; i += 1) {
        const chunk = JSON.stringify({ id: i + 1, timestamp: Date.now() });
        res.write(chunk);
        if (i < 4) {
            res.write(',');
        }
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
    res.end(']');
});

export default router;

