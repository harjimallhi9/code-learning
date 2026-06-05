const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'locations.db');
const PUBLIC_DIR = path.join(__dirname, 'public');

let db = null;
let deviceCounter = 1;
const devices = new Map();

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

app.get('/', (req, res) => res.redirect('/dashboard.html'));

function saveToDisk() {
  if (!db) return;
  fs.writeFileSync(DB_FILE, Buffer.from(db.export()));
}

function getNextDeviceId() {
  return `device-${deviceCounter++}`;
}

function publicDeviceList() {
  return Array.from(devices.values()).map(d => ({
    deviceId: d.deviceId,
    label: d.label,
    status: d.status,
    pings: d.pings || 0,
    lastSeen: d.lastSeen || null,
    lastLocation: d.lastLocation || null
  }));
}

function emitDevices() {
  io.emit('devices-list', publicDeviceList());
}

initSqlJs().then(SQL => {
  db = fs.existsSync(DB_FILE)
    ? new SQL.Database(fs.readFileSync(DB_FILE))
    : new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      label TEXT,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      accuracy REAL,
      timestamp TEXT DEFAULT (datetime('now'))
    )
  `);

  try { db.run('ALTER TABLE locations ADD COLUMN label TEXT'); } catch (_) {}
  try { db.run('ALTER TABLE locations ADD COLUMN accuracy REAL'); } catch (_) {}

  saveToDisk();
  console.log('Database ready');
});

app.get('/history/:deviceId', (req, res) => {
  if (!db) return res.json([]);

  const stmt = db.prepare(`
    SELECT device_id, label, lat, lng, accuracy, timestamp
    FROM locations
    WHERE device_id = ?
    ORDER BY id DESC
    LIMIT 200
  `);

  stmt.bind([req.params.deviceId]);

  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());

  stmt.free();
  res.json(rows.reverse());
});

io.on('connection', socket => {
  console.log('Connected:', socket.id);

  socket.on('dashboard-join', () => {
    socket.data.role = 'dashboard';
    socket.emit('devices-list', publicDeviceList());
  });

  socket.on('tracker-join', data => {
    const oldId = data && data.deviceId;
    const label = (data && data.label && String(data.label).trim()) || '';

    const deviceId = oldId && devices.has(oldId) ? oldId : getNextDeviceId();

    const device = devices.get(deviceId) || {
      deviceId,
      label: label || `Device ${deviceId.replace('device-', '')}`,
      status: 'pending',
      pings: 0
    };

    device.socketId = socket.id;
    device.label = label || device.label;
    device.lastSeen = new Date().toISOString();

    devices.set(deviceId, device);

    socket.data.role = 'tracker';
    socket.data.deviceId = deviceId;

    socket.emit('tracker-registered', {
      deviceId,
      label: device.label,
      status: device.status
    });

    emitDevices();
    console.log(`Tracker joined: ${deviceId} / ${device.status}`);
  });

  socket.on('approve-device', ({ deviceId }) => {
    const device = devices.get(deviceId);
    if (!device) return;

    device.status = 'approved';
    devices.set(deviceId, device);

    io.to(device.socketId).emit('approval-updated', { deviceId, status: 'approved' });
    emitDevices();

    console.log('Approved:', deviceId);
  });

  socket.on('reject-device', ({ deviceId }) => {
    const device = devices.get(deviceId);
    if (!device) return;

    device.status = 'rejected';
    devices.set(deviceId, device);

    io.to(device.socketId).emit('approval-updated', { deviceId, status: 'rejected' });
    emitDevices();

    console.log('Rejected:', deviceId);
  });

  socket.on('rename-device', ({ deviceId, label }) => {
    const device = devices.get(deviceId);
    if (!device || !label) return;

    device.label = String(label).trim();
    devices.set(deviceId, device);

    io.to(device.socketId).emit('device-renamed', { deviceId, label: device.label });
    emitDevices();
  });

  socket.on('send-location', data => {
    const deviceId = socket.data.deviceId || (data && data.deviceId);
    const device = devices.get(deviceId);

    if (!device) {
      socket.emit('tracking-error', 'Device is not registered.');
      return;
    }

    if (device.status !== 'approved') {
      socket.emit('tracking-error', 'Waiting for dashboard approval.');
      return;
    }

    const lat = Number(data.lat);
    const lng = Number(data.lng);
    const accuracy = Number(data.accuracy || 0);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const timestamp = new Date().toISOString();

    device.pings = (device.pings || 0) + 1;
    device.lastSeen = timestamp;
    device.lastLocation = { lat, lng, accuracy, timestamp };
    devices.set(deviceId, device);

    if (db) {
      db.run(
        'INSERT INTO locations (device_id, label, lat, lng, accuracy) VALUES (?, ?, ?, ?, ?)',
        [device.deviceId, device.label, lat, lng, accuracy]
      );
      saveToDisk();
    }

    io.emit('location-update', {
      deviceId: device.deviceId,
      label: device.label,
      lat,
      lng,
      accuracy,
      timestamp,
      pings: device.pings
    });

    emitDevices();

    console.log(`[${device.deviceId}] ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
    emitDevices();
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`Tracker page  → http://localhost:${PORT}/tracker.html`);
  console.log(`Dashboard     → http://localhost:${PORT}/dashboard.html`);
  console.log('');
});
