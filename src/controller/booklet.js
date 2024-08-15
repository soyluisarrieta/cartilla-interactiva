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
    const modules = await BookletModel.getAll()

    if (!isNaN(moduleId) && moduleId >= 1 && moduleId <= modules.length) {
      res.render(`modules/module-${moduleId}`, { layout: 'slides', moduleId })
    } else {
      res.status(404).render('404')
    }
  }
}
