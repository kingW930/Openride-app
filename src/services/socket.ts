// src/services/socket.ts
import io from 'socket.io-client';
import { getToken } from '@/utils/storage';

class SocketService {
  private socket: any = null;
  private url: string;
  private connectionAttempted: boolean = false;

  constructor() {
    this.url = process.env.EXPO_PUBLIC_SOCKET_URL || '';
  }

  async connect() {
    // Skip connection if no URL configured or already attempted
    if (!this.url || this.connectionAttempted) {
      return null;
    }

    if (this.socket && this.socket.connected) return this.socket;

    this.connectionAttempted = true;
    const token = await getToken().catch(() => null);

    try {
      this.socket = io(this.url, {
        transports: ['websocket'],
        auth: token ? { token } : undefined,
        reconnection: true,
        reconnectionAttempts: 3, // Reduced attempts
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        timeout: 5000, // 5 second timeout
      });

      this.socket.on('connect', () => {
        console.log('[socket] connected', this.socket.id);
      });

      this.socket.on('disconnect', (reason: any) => {
        console.log('[socket] disconnected', reason);
      });

      this.socket.on('connect_error', (err: any) => {
        // Only log once, not on every retry
        if (this.socket?.io?.backoff?.attempts <= 1) {
          console.warn('[socket] Server not available - running in offline mode');
        }
      });

      return this.socket;
    } catch (error) {
      console.warn('[socket] Failed to initialize socket');
      return null;
    }
  }

  on(event: string, cb: (...args: any[]) => void) {
    this.socket?.on(event, cb);
  }

  off(event: string, cb?: (...args: any[]) => void) {
    this.socket?.off(event, cb);
  }

  emit(event: string, payload?: any, ack?: (res: any) => void) {
    if (!this.socket?.connected) {
      // Silently ignore in development when no server
      return;
    }
    this.socket.emit(event, payload, ack);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
    this.connectionAttempted = false;
  }

  isConnected() {
    return !!this.socket?.connected;
  }
}

export const socketService = new SocketService();
export const useSocket = () => socketService;
