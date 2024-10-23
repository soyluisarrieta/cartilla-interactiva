import logger from '../lib/winston/logger.js'
import { GameModel } from '../models/game.js'

export class GameController {
  constructor ({ profile, game }) {
    this.profile = profile
    this.game = game
    this.gameModel = new GameModel({ profile, game })
  }

  async levelCompleted (levelData) {
    try {
      if (!levelData || typeof levelData !== 'object') {
        throw new Error('Datos del nivel inválidos.')
      }
      await this.gameModel.saveLevel(levelData)
    } catch (error) {
      logger.error('Error en el nivel:', error)
      logger.error('Error en  el nivel:', error)
      throw error
    }
  }
}
