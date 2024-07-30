import { Router } from 'express'
import { BookletController } from '../controller/booklet.js'

export default function webRouter () {
  const router = Router()

  // Páginas extras
  router.get('/', (req, res) => res.render('home'))
  router.get('/calentamiento', (req, res) => res.render('warm-up'))

  // Cartilla
  const bookletController = new BookletController()
  router.use('/cartilla', bookletController.renderAllModules)
  router.get('/cartilla/modulo-:id', bookletController.renderModule)

  // Zona de juegos
  router.get('/zona-de-juegos', (req, res) => res.render('game-zone'))
  router.get('/zona-de-juegos/la-figura-negra', (req, res) => res.render('games/g1-quarter-note'))

  // Middleware: para manejar errores 404
  router.use((req, res, next) => {
    res.status(404).render('404')
  })

  return router
}
