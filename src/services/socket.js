import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('⚡ Connected to RESQ Real-Time WebSockets Engine:', socket.id);
});

socket.on('disconnect', () => {
  console.log('🔌 Disconnected from RESQ WebSockets Engine');
});
