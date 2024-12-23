import { io } from '/assets/lib/socketio/socket.io.esm.min.js'
import { getSessionId } from './utils/generateId.js'
import { getProfile, setProfile } from '../../scripts/profile.js'

export default class Socket {
  constructor () {
    // Verificar si ya existe una conexión compartida
    if (window.sharedSocket) {
      this.socket = window.sharedSocket
    } else {
      const game = window.gameSettings
      const sessionId = getSessionId()
      const profile = getProfile()
      const payload = {
        query: {
          sessionId,
          profile: JSON.stringify({
            id: profile.id,
            username: profile.username,
            avatar: profile.avatar,
            serial: profile.serial
          }),
          game: JSON.stringify(game)
        }
      }

      // Reconectar
      this.socket = io(payload)

      // Guardar la conexión
      window.sharedSocket = this.socket

      this.socket.on('connect', () => {
        // console.log('Conexión establecida con sessionId:', sessionId)
      })

      // Manejar la desconexión
      this.socket.on('disconnect', () => {
        window.sharedSocket = null
        // console.log('Socket desconectado')
      })
    }
  }

  // Enviar info del nivel completado
  levelCompleted (payload) {
    this.socket.emit('levelCompleted', payload)
    const timestamp = new Date().toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Bogota'
    })
    setProfile({ timestamp })
  }
}
