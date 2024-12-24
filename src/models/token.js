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
      timestamp: { type: Number, default: Date.now },
      used: { type: Boolean, default: false }
    })
  }

  async save ({ generatedToken, serial }) {
    try {
      const token = await this.Tokens.create({ token: generatedToken, serial })
      await token.save()
      await this.Tokens.remove(t => t.token !== generatedToken)
    } catch (error) {
      logger.error('Error al guardar el token de restauración:', error)
    }
  }

  async getSerial (token) {
    try {
      const data = await this.Tokens.findOne({ token })
      if (!data) {
        return { error: 'No se encontró el token de restauración' }
      }
      if (Date.now() - data.timestamp > 20000) {
        await this.Tokens.remove({ _id: data._id })
        return { error: 'El Token de restauración ha expirado.' }
      }
      if (data.used) {
        return { error: 'El Token de restauración ya ha sido usado.' }
      }
      const usedToken = await this.Tokens.update({ _id: data._id }, { used: true })
      usedToken.save()
      return data.serial
    } catch (error) {
      logger.error('Error al obtener los perfiles usando el token de restauración:', error)
    }
  }
}
