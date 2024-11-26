import { useEffect } from 'react';
import { ipcRenderer } from '@/constants';
import { useIPStore } from '@/store/useIPStore';

export const useLocalIP = () => {
  const { localIP, setLocalIP } = useIPStore()

  useEffect(() => {
    async function fetchIP() {
      const ip = await ipcRenderer.invoke('getIP');
      setLocalIP(ip);
    }
    
    !localIP && fetchIP();
  }, [localIP, setLocalIP]);

  return localIP;
};
