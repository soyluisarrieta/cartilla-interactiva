import { fileURLToPath } from 'url'
import path from 'node:path'
import fs from 'node:fs'

// Modo desarrollador
export const DEV_MODE = process.env.NODE_ENV === 'development'

// Obtener la ruta de la raíz del proyecto
const __filename = fileURLToPath(import.meta.url)
export const SRC_FOLDER = path.dirname(__filename)

// Puerto
export const PORT = process.env.PORT || 5000

export const USER_DATA = (app) => {
  const userData = app.getPath('userData')
  const dbFolderPath = path.join(userData, 'db', 'games')
  if (!fs.existsSync(dbFolderPath)) {
    fs.mkdirSync(dbFolderPath, { recursive: true })
  }
  return userData
}

// Esquema básico
export const STANDARD_SCHEMA = {
  _id: { type: String, required: true },
  level: {
    name: { type: String, required: true },
    totalTimer: { type: Number, required: true },
    notes: { type: Array }
  },
  exercises: { type: Array, required: true },
  timestamp: { type: Number, default: Date.now }
}

// Juegos
export const GAMES = [
  {
    id: 'g1-the-figures-and-their-silences',
    slug: 'las-figuras-y-sus-silencios',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g2-what-rhythm-is-playing',
    slug: 'que-ritmo-suena',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g3-the-eighth-note-figure',
    slug: 'la-figura-corchea',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g4-the-sixteenth-note-figure',
    slug: 'la-figura-semicorchea',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g5-the-eighth-rest-figure',
    slug: 'la-figura-silencio-de-corchea',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g6-play-with-the-rhythm',
    slug: 'juega-con-el-ritmo',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g7-do-the-tones-go-up-or-down',
    slug: 'suben-o-bajan-los-tonos',
    schema: {
      _id: { type: String, required: true },
      bestScore: { type: Number, required: true },
      time: { type: Number, required: true },
      timestamp: { type: Number, default: Date.now }
    }
  },
  {
    id: 'g8-do-re-mi',
    slug: 'do-re-mi',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g9-fa-sol-la',
    slug: 'fa-sol-la',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g10-la-si-do',
    slug: 'la-si-do',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g11-do-scale',
    slug: 'escala-de-do',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g12-treble-clef',
    slug: 'clave-de-sol',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g13-major-scales',
    slug: 'escalas-mayores',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g14-chromatic-scales',
    slug: 'escalas-cromaticas',
    schema: STANDARD_SCHEMA
  },
  {
    id: 'g15-major-and-minor-scales',
    slug: 'escalas-mayores-y-menores',
    schema: STANDARD_SCHEMA
  }
]

export const MODULES = [
  { _id: '1', title: 'Módulo 1', description: '' },
  { _id: '2', title: 'Módulo 2', description: '' },
  { _id: '3', title: 'Módulo 3', description: '' },
  { _id: '4', title: 'Módulo 4', description: '' },
  { _id: '5', title: 'Módulo 5', description: '' }
]
