import { io } from 'socket.io-client';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Single shared socket instance for the whole app - components join/leave
// rooms via emits, they don't each open their own connection.
export const socket = io(BASE, { autoConnect: false });
