import DBLocal from 'db-local'
import logger from '../lib/winston/logger.js'
import { USER_DATA } from '../constants.js'
import { app } from 'electron'

export class TokenModel {
  constructor () {
    this.path = `${USER_DATA(app)}/db`
    const { Schema } = new DBLocal({ path: this.path })
    this.Tokens = Schema('tokens', {
      token: { type: String, required: true },
      serial: { type: String, required: true },
      timestamp: { type: Number, default: Date.now }
    })
  }

  async save ({ generatedToken, serial }) {
    try {
      const token = await this.Tokens.create({ token: generatedToken, serial })
      await token.save()
    } catch (error) {
      logger.error('Error al guardar el token de restauración:', error)
    }
  }

  async deleteAll () {
    try {
      const tokens = await this.Tokens.find()
      for (const token of tokens) {
        await this.Tokens.remove({ _id: token._id })
      }
    } catch (error) {
      logger.error('Error al eliminar los tokens expirados:', error)
    }
  }
}
