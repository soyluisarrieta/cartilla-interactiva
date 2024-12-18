import logger from '../lib/winston/logger.js'
import { ProfileModel } from '../models/profile.js'
import { TokenModel } from '../models/token.js'

export class TokensController {
  constructor ({ socket }) {
    this.socket = socket
    this.profileModel = new ProfileModel({})
    this.tokenModel = new TokenModel()
  }

  async generate ({ token, profiles }) {
    try {
      await this.tokenModel.deleteAll()
      await this.tokenModel.save({ generatedToken: token, profiles })
      return token
    } catch (error) {
      logger.error('Hubo un error al generar el token de restauración:', error)
      throw error
    }
  }

  getProfilesByToken (id) {
    try {

    } catch (error) {
      logger.error('Hubo un error al obtener los perfiles usando el token de restauración:', error)
      throw error
    }
  }
}
