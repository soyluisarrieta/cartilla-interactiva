import path from 'path'
import exphbs from 'express-handlebars'
import { SRC_FOLDER } from '../../constants.js'

// Helper para manejar secciones en Handlebars
export const hbs = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: path.join(SRC_FOLDER, '..', 'browser', 'layouts'),
  partialsDir: path.join(SRC_FOLDER, '..', 'browser', 'components'),
  extname: 'hbs',
  helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {}
      this._sections[name] = options.fn(this)
      return null
    }
  }
})
