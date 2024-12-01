import { MODULES } from '../constants.js'

export class BookletController {
  /**
   * Renderizar la página con todos los módulos
   */
  renderAllModules = (req, res) => {
    const modules = MODULES
    res.render('booklet', { modules })
  }

  /**
   * Renderizar el módulo seleccionado
   */
  renderModule = (req, res) => {
    const moduleId = parseInt(req.params.id, 10)
    const modules = MODULES
    if (!isNaN(moduleId) && moduleId >= 1 && moduleId <= modules.length) {
      res.render(`modules/module-${moduleId}`, { layout: 'slides', moduleId })
    } else {
      res.status(404).render('404')
    }
  }
}
