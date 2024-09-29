import { Server } from 'socket.io'
import socketRoutes from '../routes/socket.js'

export class SocketController {
  constructor () {
    this.io = null
    this.game = {}
    this.connectedSockets = {}
  }

  // Crear conexión
  connect (expressServer) {
    this.io = new Server(expressServer)
    this.io.on('connection', (socket) => this.handleConnection(socket))
  }

  // Manejar conexión por navegador
  handleConnection (socket) {
    const { socketId, game } = socket.handshake.query
    this.game = JSON.parse(game)

    if (socketId && this.connectedSockets[socketId]) {
      console.log(`Reutilizando socket: ${socketId}`)
      const oldSocket = this.connectedSockets[socketId]
      oldSocket.disconnect(true)
    }

    this.connectedSockets[socket.id] = socket
    socket.emit('newSocketId', socket.id)

    console.log(`Un usuario se ha conectado - Total de usuarios: ${Object.keys(this.connectedSockets).length}`)

    // Rutas
    socketRoutes(socket, this.game)

    socket.on('disconnect', () => this.handleDisconnect(socket))
  }

  // Manejador de desconexión
  handleDisconnect (socket) {
    delete this.connectedSockets[socket.id]
    console.log(`Un usuario se ha desconectado - Total de usuarios: ${Object.keys(this.connectedSockets).length}`)
  }
}
