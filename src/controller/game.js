import logger from '../lib/winston/logger.js'
import { GameModel } from '../models/game.js'
import { ProfileModel } from '../models/profile.js'

export class GameController {
  constructor ({ profile, game }) {
    this.profile = profile
    this.game = game
    this.gameModel = new GameModel({ profile, game })
    this.profileModel = new ProfileModel({ serial: profile.serial })
    this.saveProfile(profile)
  }

  async saveProfile (profile) {
    try {
      if (!profile || typeof profile !== 'object') {
        throw new Error('Datos del perfil inválidos.')
      }
      const { id, ...data } = profile
      await this.profileModel.save({ userId: id, ...data })
    } catch (error) {
      logger.error('Hubo un error al guardar un nuevo perfil:', error)
      throw error
    }
  }

  async levelCompleted (levelData) {
    try {
      if (!levelData || typeof levelData !== 'object') {
        throw new Error('Datos del nivel inválidos.')
      }
      await this.gameModel.saveLevel(levelData)
    } catch (error) {
      logger.error('Error en  el nivel:', error)
      throw error
    }
  }
}
