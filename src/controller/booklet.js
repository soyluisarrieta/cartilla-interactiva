import { NUMBER_BOOKLET_MODULES } from '../constants.js'

export class BookletController {
  /**
   * Renderizar el módulo seleccionado
   */
  renderModule = (req, res) => {
    const moduleId = parseInt(req.params.id, 10)

    if (!isNaN(moduleId) && moduleId >= 1 && moduleId <= NUMBER_BOOKLET_MODULES) {
      res.render('booklet', { moduleId })
    } else {
      res.status(404).render('404')
    }
  }
}
