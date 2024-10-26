import { io } from '/assets/lib/socketio/socket.io.esm.min.js'
import { getSessionId } from './utils/generateId.js'
import { getProfile } from '../../scripts/Profile.js'

export default class Socket {
  constructor (gameScene) {
    this.game = gameScene

    // Verificar si ya existe una conexión compartida
    if (window.sharedSocket) {
      this.socket = window.sharedSocket
    } else {
      const sessionId = getSessionId()
      const profile = getProfile()
      const payload = {
        query: {
          sessionId,
          profile: JSON.stringify({
            id: profile.id,
            username: profile.username,
            avatar: profile.avatar
          }),
          game: JSON.stringify(profile.games[window.gameSettings.id])
        }
      }

      // Reconectar
      this.socket = io(payload)

      // Guardar la conexión
      window.sharedSocket = this.socket

      this.socket.on('connect', () => {
        console.log('Conexión establecida con sessionId:', sessionId)
      })

      // Manejar la desconexión
      this.socket.on('disconnect', () => {
        window.sharedSocket = null
        console.log('Socket desconectado')
      })
    }
  }

  // Enviar info del nivel completado
  levelCompleted (payload) {
    this.socket.emit('levelCompleted', payload)
  }
}
