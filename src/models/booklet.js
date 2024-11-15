import DBLocal from 'db-local'
import { USER_DATA } from '../constants.js'
import { app } from 'electron'

const { Schema } = new DBLocal({ path: `${USER_DATA(app)}/db` })

const Modules = Schema('Modules', {
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
})

export class BookletModel {
  static async getAll () {
    try {
      const allModules = await Modules.find().reverse()
      return allModules
    } catch (error) {
      console.error('Error obteniendo los módulos:', error)
      throw error
    }
  }
}
