import { Server } from 'socket.io'
import socketRoutes from '../routes/socket.js'
import { LeaderboardController } from './leaderboard.js'
import { ProfileModel } from '../models/profile.js'
import { TokensController } from './tokens.js'

export class SocketController {
  constructor () {
    this.io = null
    this.connectedUsers = {}
    this.sessionConnections = {}
  }

  // Crear conexión
  connect (expressServer) {
    this.resetOnlines()
    this.io = new Server(expressServer, {
      cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
      }
    })
    this.io.on('connection', (socket) => this.handleConnection(socket))
  }

  // Manejar conexión por navegador
  async handleConnection (socket) {
    socket.on('init', async ({ game }) => {
      if (socket?.handshake?.address !== '127.0.0.1') { return null }
      const leaderboard = await new LeaderboardController({ game }).getAllScores()
      socket.emit('leaderboard', leaderboard)
    })
    socket.on('generateToken', async (data) => {
      if (socket?.handshake?.address !== '127.0.0.1') { return null }
      const tokenController = new TokensController({ socket })
      tokenController.generate(data)
    })
    socket.on('restoreProfiles', async (token) => {
      const tokenController = new TokensController({ socket })
      const response = await tokenController.getProfilesByToken(token)
      socket.emit('restoredProfiles', response)
    })

    const { sessionId, game: rawGame, profile: rawProfile } = socket.handshake.query
    if (!rawGame || !rawProfile) { return }

    const game = JSON.parse(rawGame)
    const profile = JSON.parse(rawProfile)
    this.ProfileModel = new ProfileModel(profile)

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
    socket.on('disconnect', async () => {
      await this.ProfileModel.setOnline(profile.id, false)
      const leaderboard = await new LeaderboardController({ game }).getAllScores()
      socket.broadcast.emit('leaderboard', leaderboard)
      this.handleDisconnect(socket, sessionId)
    })
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

  async resetOnlines () {
    const profiles = new ProfileModel({})
      .getAll()
      .filter(({ isOnline }) => isOnline)

    profiles.forEach(({ serial, userId }) => {
      new ProfileModel({ serial }).setOnline(userId, false)
    })
  }
}
