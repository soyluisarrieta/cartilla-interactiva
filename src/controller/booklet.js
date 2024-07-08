import path from 'node:path'
import fs from 'node:fs'
import { NUMBER_BOOKLET_MODULES, SRC_FOLDER } from '../constants.js'
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

    const directoryPath = path.join(SRC_FOLDER, '..', 'browser', 'assets', 'images', 'slides', `module-${moduleId}`)

    if (!isNaN(moduleId) && moduleId >= 1 && moduleId <= NUMBER_BOOKLET_MODULES) {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          return res.status(500).send('No se pudo leer el directorio: ' + err)
        }

        const imageFiles = files.filter(file => {
          const fileExtension = path.extname(file).toLowerCase()
          return ['.jpg', '.png'].includes(fileExtension)
        }).sort((a, b) => {
          const aNum = parseInt(path.basename(a, path.extname(a)), 10)
          const bNum = parseInt(path.basename(b, path.extname(b)), 10)
          return aNum - bNum
        })

        res.render('slides', { moduleId, imageFiles })
      })
    } else {
      res.status(404).render('404')
    }
  }
}
