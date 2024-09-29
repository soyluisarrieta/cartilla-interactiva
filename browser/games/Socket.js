import { io } from '/assets/lib/socketio/socket.io.esm.min.js'

export default class Socket {
  constructor (gameScene) {
    this.game = gameScene
    this.settings = window.gameSettings

    // Crear conexión o reconectar si ya cuenta socketId
    const existingSocketId = window.localStorage.getItem('socketId')
    if (existingSocketId) {
      this.socket = io({
        query: {
          socketId: existingSocketId,
          game: JSON.stringify(this.settings)
        }
      })
    } else {
      this.socket = io()
      this.socket.on('connect', () => {
        window.localStorage.setItem('socketId', this.socket.id)
      })
    }

    // Establecer socketId
    this.socket.on('newSocketId', (newSocketId) => {
      window.localStorage.setItem('socketId', newSocketId)
    })
  }

  // Enviar información del nivel
  sendLevelData (levelData) {
    this.socket.emit('levelComplete', levelData)
    console.log('Datos del nivel enviados:', levelData)
  }
}
