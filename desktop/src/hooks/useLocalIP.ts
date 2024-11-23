import { useState, useEffect } from 'react';
const { ipcRenderer } = require('electron');

const useLocalIP = () => {
  const [localIP, setLocalIP] = useState();

  useEffect(() => {
    async function fetchIP() {
      const ip = await ipcRenderer.invoke('getIP');
      setLocalIP(ip);
    }
    !localIP && fetchIP();
  }, []);

  return localIP;
};

export default useLocalIP;
