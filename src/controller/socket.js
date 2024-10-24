import { Server } from 'socket.io'
import socketRoutes from '../routes/socket.js'

export class SocketController {
  constructor () {
    this.io = null
    this.connectedUsers = {}
    this.sessionConnections = {}
  }

  // Crear conexión
  connect (expressServer) {
    this.io = new Server(expressServer)
    this.io.on('connection', (socket) => this.handleConnection(socket))
  }

  // Manejar conexión por navegador
  handleConnection (socket) {
    const { sessionId, game: rawGame, profile: rawProfile } = socket.handshake.query
    const game = JSON.parse(rawGame)
    const profile = JSON.parse(rawProfile)

    // Si el sessionId ya existe, incrementar el contador de conexiones
    if (this.connectedUsers[sessionId]) {
      this.sessionConnections[sessionId]++
      console.log(`Pestaña adicional para sessionId "${sessionId}" - Total de conexiones: ${this.sessionConnections[sessionId]}`)
    } else {
      // Si es una nueva sesión, inicializar la conexión
      this.connectedUsers[sessionId] = socket.id
      this.sessionConnections[sessionId] = 1
      console.log(`Un nuevo usuario con sessionId "${sessionId}" se ha conectado - Total de usuarios: ${Object.keys(this.connectedUsers).length}`)
    }

    // Rutas
    socketRoutes(socket, { game, profile })

    // Manejar la desconexión
    socket.on('disconnect', () => this.handleDisconnect(socket, sessionId))
  }

  // Manejador de desconexión
  handleDisconnect (socket, sessionId) {
    this.sessionConnections[sessionId]--

    // Verificar si es la última pestaña en cerrarse
    if (this.sessionConnections[sessionId] === 0) {
      delete this.connectedUsers[sessionId]
      delete this.sessionConnections[sessionId]
      console.log(`Usuario con sessionId "${sessionId}" se ha desconectado completamente - Total de usuarios: ${Object.keys(this.connectedUsers).length}`)
    } else {
      console.log(`Pestaña cerrada para sessionId "${sessionId}" - Conexiones restantes: ${this.sessionConnections[sessionId]}`)
    }
  }
}
