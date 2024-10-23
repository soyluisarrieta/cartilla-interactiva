import { io } from '/assets/lib/socketio/socket.io.esm.min.js'
import { getSessionId } from './utils/generateId.js'

export default class Socket {
  constructor (gameScene) {
    this.game = gameScene
    this.settings = window.gameSettings

    // Verificar si ya existe una conexión compartida
    if (window.sharedSocket) {
      this.socket = window.sharedSocket
    } else {
      const sessionId = getSessionId()

      // Reconectar
      this.socket = io({
        query: {
          sessionId,
          game: JSON.stringify(this.settings)
        }
      })

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

  // Enviar información del nivel
  sendLevelData (levelData) {
    this.socket.emit('levelComplete', levelData)
  }
}
