import fs from 'node:fs'
import path from 'node:path'
import { SRC_FOLDER } from '../constants.js'

export class ResourcesController {
  render = (req, res) => {
    const { language, 0: subpath } = req.params
    const currentPath = subpath ? subpath.split('/').join(path.sep) : ''
    const basePath = path.join(SRC_FOLDER, '..', 'browser', 'recursos', language, currentPath)

    fs.readdir(basePath, { withFileTypes: true }, (err, files) => {
      if (err) {
        // console.error(err)
        return res.status(404).render('404')
      }

      const folders = files.filter(file => file.isDirectory()).map(folder => folder.name)
      const filesList = files.filter(file => file.isFile()).map(file => file.name)

      res.render('folder', { language, currentPath, folders, files: filesList })
    })
  }
}
