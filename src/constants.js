import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Obtener la ruta de la raíz del proyecto
const __filename = fileURLToPath(import.meta.url)
export const SRC_FOLDER = dirname(__filename)

// Puerto
export const PORT = process.env.PORT || 3000
