import { useEffect, useState } from 'react';
import { ipcRenderer } from '@/constants';

export const useLocalIP = () => {
  const [localIP, setLocalIP] = useState(null)

  useEffect(() => {
    async function fetchIP() {
      const ip = await ipcRenderer.invoke('getIP');
      setLocalIP(ip);
    }
    
    !localIP && fetchIP();
  }, [localIP, setLocalIP]);

  return localIP;
};
