import { Router } from 'express'
import { BookletController } from '../controller/booklet.js'

export function bookletRoutes () {
  const router = Router()

  const bookletController = new BookletController()

  router.get('/', (req, res) => res.render('booklet'))
  router.get('/modulo-:id', bookletController.renderModule)

  return router
}
