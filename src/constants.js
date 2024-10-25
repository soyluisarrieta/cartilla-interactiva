import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Obtener la ruta de la raíz del proyecto
const __filename = fileURLToPath(import.meta.url)
export const SRC_FOLDER = dirname(__filename)

// Puerto
export const PORT = process.env.PORT || 3000

// Juegos
export const GAMES = [
  {
    id: 'g1-the-figures-and-their-silences',
    slug: 'las-figuras-y-sus-silencios'
  },
  {
    id: 'g2-what-rhythm-is-playing',
    slug: 'que-ritmo-suena'
  },
  {
    id: 'g3-the-eighth-note-figure',
    slug: 'la-figura-corchea'
  },
  {
    id: 'g4-the-sixteenth-note-figure',
    slug: 'la-figura-semicorchea'
  },
  {
    id: 'g5-the-eighth-rest-figure',
    slug: 'la-figura-silencio-de-corchea'
  },
  {
    id: 'g6-play-with-the-rhythm',
    slug: 'juega-con-el-ritmo'
  },
  {
    id: 'g7-do-the-tones-go-up-or-down',
    slug: 'suben-o-bajan-los-tonos'
  },
  {
    id: 'g8-do-re-mi',
    slug: 'do-re-mi'
  },
  {
    id: 'g9-fa-sol-la',
    slug: 'fa-sol-la'
  },
  {
    id: 'g10-la-si-do',
    slug: 'la-si-do'
  },
  {
    id: 'g11-do-scale',
    slug: 'escala-de-do'
  },
  {
    id: 'g12-treble-clef',
    slug: 'clave-de-sol'
  },
  {
    id: 'g13-major-scales',
    slug: 'escalas-mayores'
  },
  {
    id: 'g14-chromatic-scales',
    slug: 'escalas-cromaticas'
  },
  {
    id: 'g15-major-and-minor-scales',
    slug: 'escalas-mayores-y-menores'
  }
]
