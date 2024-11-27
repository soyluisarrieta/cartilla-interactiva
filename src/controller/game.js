import logger from '../lib/winston/logger.js'
import { GameModel } from '../models/game.js'
import { ProfileModel } from '../models/profile.js'

export class GameController {
  constructor ({ profile, game, socket }) {
    this.socket = socket
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

  async levelCompleted (level) {
    try {
      if (!level || typeof level !== 'object') {
        throw new Error('Datos del nivel inválidos.')
      }
      await this.gameModel.saveLevel(level)
      const data = this.getDataFromLevel(level)
      console.log(data)
    } catch (error) {
      logger.error('Error en  el nivel:', error)
      throw error
    }
  }

  getDataFromLevel (data) {
    if (this.game.game === 'ToneTilt') {
      return {
        score: data.bestScore,
        time: data.time
      }
    }

    const { level: { totalTimer, name }, ...extradata } = data
    const BASE_SCORE = 10000 // Puntaje base
    const TIME_PENALTY = 7.33 // Penalización por segundo
    const calculatedScore = Math.max(0, BASE_SCORE - (totalTimer * TIME_PENALTY))
    const score = Math.round(calculatedScore)

    return {
      ...extradata,
      levelName: name,
      time: totalTimer,
      score
    }
  }
}
