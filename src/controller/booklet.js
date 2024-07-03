import { NUMBER_BOOKLET_MODULES } from '../constants.js'
import { BookletModel } from '../models/booklet.js'

export class BookletController {
  /**
   * Renderizar la página con todos los módulos
   */
  renderAllModules = async (req, res) => {
    const modules = await BookletModel.getAll()
    res.render('booklet', { modules })
  }

  /**
   * Renderizar el módulo seleccionado
   */
  renderModule = async (req, res) => {
    const moduleId = parseInt(req.params.id, 10)

    !isNaN(moduleId) && moduleId >= 1 && moduleId <= NUMBER_BOOKLET_MODULES
      ? res.render('booklet', { moduleId })
      : res.status(404).render('404')
  }
}
