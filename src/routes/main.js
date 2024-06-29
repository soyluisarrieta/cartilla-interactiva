import { Router } from 'express'
import { bookletRoutes } from './booklet.js'

export default function mainRouter () {
  const router = Router()

  router.get('/', (req, res) => res.render('home'))
  router.use('/cartilla', bookletRoutes())

  // Middleware para manejar errores 404
  router.use((req, res, next) => {
    res.status(404).render('404')
  })

  return router
}
