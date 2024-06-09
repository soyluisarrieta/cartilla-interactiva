import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import { SRC_FOLDER, PORT } from './constants.js'
import { getLocalIpAddress } from './utils/getLocalIpAddress.js'

// Función para iniciar el servidor
export function startServer () {
  const app = express()

  // Middleware: Body-Parser
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  // Middleware: Servir archivos estáticos desde el directorio 'public'
  const publicPath = path.join(SRC_FOLDER, '..', 'public')
  app.use(express.static(publicPath))

  // Iniciar el servidor
  app.listen(PORT, () => {
    console.log(`Server running on http://${getLocalIpAddress()}:${PORT}`)
  })
}
