import { networkInterfaces } from 'os'

// Función para obtener la dirección IP local
export function getLocalIpAddress () {
  const ifaces = networkInterfaces()
  let ipAddress = 'localhost'
  Object.keys(ifaces).forEach(ifname => {
    ifaces[ifname].forEach(iface => {
      if (iface.family === 'IPv4' && !iface.internal) {
        ipAddress = iface.address
      }
    })
  })
  return ipAddress
}
