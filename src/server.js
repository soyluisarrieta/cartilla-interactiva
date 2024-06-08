import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import express from 'express'
import bodyParser from 'body-parser'

// Inicializaciones
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware: Body-Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Middleware: Servir archivos estáticos desde el directorio 'public'
const publicPath = path.join(__dirname, '..', 'public')
app.use(express.static(publicPath))

// Ejecutar servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
