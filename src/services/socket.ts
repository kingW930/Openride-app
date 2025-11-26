// src/services/socket.ts
import io from 'socket.io-client';
import { getToken } from '@/utils/storage';

class SocketService {
  private socket: any = null;
  private url: string;

  constructor() {
    this.url = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:4000';
  }

  async connect() {
    if (this.socket && this.socket.connected) return this.socket;

    const token = await getToken().catch(() => null);

    this.socket = io(this.url, {
      transports: ['websocket'],
      auth: token ? { token } : undefined,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('[socket] connected', this.socket.id);
    });

    this.socket.on('disconnect', (reason: any) => {
      console.log('[socket] disconnected', reason);
    });

    this.socket.on('connect_error', (err: any) => {
      console.error('[socket] connect_error', err.message);
    });

    return this.socket;
  }

  on(event: string, cb: (...args: any[]) => void) {
    this.socket?.on(event, cb);
  }

  off(event: string, cb?: (...args: any[]) => void) {
    this.socket?.off(event, cb);
  }

  emit(event: string, payload?: any, ack?: (res: any) => void) {
    if (!this.socket) {
      console.warn('[socket] emit called before connect', event);
      return;
    }
    this.socket.emit(event, payload, ack);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  isConnected() {
    return !!this.socket?.connected;
  }
}

export const socketService = new SocketService();
export const useSocket = () => socketService;
