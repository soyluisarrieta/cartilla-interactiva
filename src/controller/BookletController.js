import { NUMBER_BOOKLET_MODULES } from '../constants.js'

export class BookletController {
  /**
   * Renderizar el módulo seleccionado
   */
  renderModule = (req, res) => {
    const moduleId = req.params.id
    moduleId <= NUMBER_BOOKLET_MODULES
      ? res.render('booklet', { moduleId })
      : res.status(404).render('404')
  }
}
