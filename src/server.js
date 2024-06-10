import path from 'path'
import express, { json } from 'express'
import { SRC_FOLDER, PORT } from './constants.js'
import { getLocalIpAddress } from './utils/getLocalIpAddress.js'

// Función para iniciar el servidor
export function startServer () {
  const app = express()

  // Middleware: Configurar express como json y x-powered-by deshabilitado
  app.use(json())
  app.disable('x-powered-by')

  // Middleware: Servir archivos estáticos desde el directorio 'browser'
  const browserPath = path.join(SRC_FOLDER, '..', 'browser')
  app.use(express.static(browserPath))

  // Iniciar el servidor
  app.listen(PORT, () => {
    console.log(`Server running on http://${getLocalIpAddress()}:${PORT}`)
  })
}
