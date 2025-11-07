# Remote Client Test Server

Express server exposing a wide range of endpoints so you can exercise every feature of the `remote_client` package locally.

## Setup

```bash
cd /Users/wac/Documents/package/remote_client/server
npm install
```

## Run

```bash
npm run dev   # with hot reload (nodemon)
# or
npm start     # production-style
```

Server starts on `http://localhost:4000` by default. Override with `PORT=5000 npm start`.

## Endpoint Highlights

`GET /api/health` – health check

`GET /api/users` – success payload with optional `?delay=ms`

`GET /api/users/:id` – 200 or 404

`POST /api/users` – validation errors and 201 success

`GET /api/errors/*` – curated HTTP errors (`bad-request`, `unauthorized`, `forbidden`, `not-found`, `server`, `unavailable`, `gateway-timeout`, `timeout`, `bad-response`, `slow-stream`)

`POST /api/auth/login` – issues bearer token

`GET /api/auth/protected` – requires `Authorization: Bearer <token>` and `x-api-key: super-secret`

`GET /api/retry/flaky` – fails twice, succeeds on third attempt

`GET /api/retry/rate-limit` – returns 429 with `Retry-After` headers until fourth call

`POST /api/files/upload` – multipart upload (field `file`)

`POST /api/files/uploads` – multiple file upload (field `files`)

`GET /api/files/download` – binary response with download headers

`GET /api/files/stream` – chunked JSON stream

`POST /api/transform/echo` – echoes request body (good for request transforms)

`POST /api/transform/enrich` – returns enriched payload for response transforms

`GET /api/meta/paginated?page=2&limit=5` – paginated response with metadata

`GET /api/headers/inspect` – reflects headers for testing custom header injection

`GET /api/config` – shows server environment info

## Resetting Retry Counters

`GET /api/retry/reset` resets in-memory counters for flaky and rate-limited routes.

## Notes

- Endpoints return JSON with `success`, `data`, `message`, and optional `meta`/`error` fields so they map nicely to `remote_client` models.
- Simulated timeouts deliberately delay the response, so configure the client timeouts to observe failures.
- `errors/bad-response` sets JSON headers but returns invalid JSON, handy for parser error tests.

