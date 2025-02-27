import { io } from 'socket.io-client';

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const { ipcRenderer } = require('electron');

export const HOST = 'http://localhost:1234'
export const SOCKET = io(HOST);

export const PATH = {
  AVATARS: '/assets/images/avatars',
  LOGOS: '/assets/images/logos'
}