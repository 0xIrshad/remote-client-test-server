import http from 'http';

import app from './app.js';

const PORT = Number.parseInt(process.env.PORT ?? '4000', 10);

const server = http.createServer(app);

server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Remote Client test server listening on http://localhost:${PORT}`);
});

const shutdown = (signal) => {
    // eslint-disable-next-line no-console
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(() => {
        process.exit(0);
    });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

