# Nomad — Private Live Location Sharing

Rebuilt from the original GPS tracker prototype as a token-based, two-role
(owner / recipient) React app.

## Project layout

```
tracker/
  server/     Express + Socket.IO + better-sqlite3 API
  client/     React + Vite frontend
```

## Running it locally

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev
```
Runs on http://localhost:4000.

### 2. Frontend

```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Runs on http://localhost:5173 (proxies /api to the backend, see vite.config.js).

Open http://localhost:5173, click "Create Tracking Link", then open the
generated `/share/:token` link in another browser/device (or an incognito
window) to act as the recipient.

## How the security model works

- Each session gets **two independent random tokens**: `owner_token` (kept
  only in the creator's browser, via localStorage) and `share_token` (the
  public part of the `/share/:token` link).
- The server never accepts a raw `sessionId` as authorization — every
  socket event and REST call that reads or writes session data validates
  the token against the database first.
- Recipients can only send location data for the exact session tied to
  their `share_token`, and only after clicking "Share My Location" — the
  browser's native geolocation prompt is what actually starts anything.
- Sessions expire server-side on an interval sweep (`services/expiry.js`),
  not client-side, so an expired link can't be revived by faking a client
  clock.

## What's next

- Add auth around `/dashboard` if you want to prevent someone else's
  browser from listing sessions even if they somehow guessed a stray
  owner_token (currently mitigated only by the token's entropy).
- Move from `better-sqlite3` to Postgres if you deploy to a
  serverless/multi-instance host — the query layer in `db.js` is small
  enough to port directly.
- Add push notifications / sound for "link opened" and "sharing started"
  events instead of relying on the dashboard being open.
