import { useIPStore } from '@/store/useIPStore';
import { useEffect } from 'react';
const { ipcRenderer } = require('electron');

export const useLocalIP = () => {
  const { localIP, setLocalIP } = useIPStore()

  useEffect(() => {
    async function fetchIP() {
      const ip = await ipcRenderer.invoke('getIP');
      setLocalIP(ip);
    }
    !localIP && fetchIP();
  }, []);

  return localIP;
};
