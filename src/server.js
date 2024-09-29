import path from 'path'
import express, { json } from 'express'
import http from 'http'
import { SRC_FOLDER, PORT } from './constants.js'
import { getLocalIpAddress } from './utils/getLocalIpAddress.js'
import { hbs } from './lib/handlebars/helper.js'
import webRouter from './routes/web.js'
import { SocketController } from './controller/socket.js'

// Función para iniciar el servidor
export function startServer () {
  const app = express()

  // Configuración de Handlebars como motor de vistas
  app.engine('hbs', hbs.engine)
  app.set('view engine', 'hbs')
  app.set('views', path.join(SRC_FOLDER, '..', 'browser', 'pages'))

  // Middleware: Configurar express como json y x-powered-by deshabilitado
  app.use(json())
  app.disable('x-powered-by')

  // Middleware: Servir archivos estáticos desde el directorio 'browser'
  const browserPath = path.join(SRC_FOLDER, '..', 'browser')
  app.use(express.static(browserPath))

  // Router
  app.use(webRouter())

  // Crear servidor HTTP con Express app
  const httpServer = http.createServer(app)
  const expressServer = httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://${getLocalIpAddress()}:${PORT}`)
  })

  // Configurar y manejar conexiones de Socket.IO
  const socket = new SocketController(expressServer)
  socket.connect(expressServer)
}
