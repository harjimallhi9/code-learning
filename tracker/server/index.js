import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

import { sessionsRouter } from './routes/sessions.js';
import { registerSocketHandlers } from './sockets/index.js';
import { startExpirySweeper } from './services/expiry.js';
import './db.js'; // ensures schema exists on boot

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.use('/api/sessions', sessionsRouter);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: CLIENT_ORIGIN } });

registerSocketHandlers(io);
startExpirySweeper(io);

server.listen(PORT, () => {
  console.log(`Tracker API + sockets on http://localhost:${PORT}`);
});
