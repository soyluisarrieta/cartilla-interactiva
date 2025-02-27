import DBLocal from 'db-local'
import logger from '../lib/winston/logger.js'
import { USER_DATA } from '../constants.js'
import { app } from 'electron'

export class LeaderboardModel {
  constructor ({ profile, game }) {
    this.profile = profile
    this.game = game
    this.path = `${USER_DATA(app)}/db/games/${game.id}`

    const { Schema } = new DBLocal({ path: this.path })
    this.Leaderboard = Schema('leaderboard', {
      _id: { type: String, required: true },
      profileId: { type: String, required: true },
      levelName: { type: String, required: true },
      score: { type: Number, required: true },
      time: { type: Number },
      timestamp: { type: Number, default: Date.now }
    })
  }

  async getAll () {
    try {
      return await this.Leaderboard.find()
    } catch (error) {
      logger.error('Error al obtener el puntaje:', error)
    }
  }

  async getBestScore (levelName) {
    try {
      return await this.Leaderboard.findOne({ profileId: this.profile.id, levelName })
    } catch (error) {
      logger.error('Error al obtener el puntaje:', error)
    }
  }

  async save ({ levelName = 'unique', score, time, ...extradata }) {
    try {
      const prevRecord = await this.getBestScore(levelName)

      // Guardar record de jugador
      if (!prevRecord) {
        await this.Leaderboard
          .create({ profileId: this.profile.id, levelName, score, time, extradata })
          .save()
        return true
      }

      // Actualizar record de jugador
      if (score > prevRecord.score || time < prevRecord.time) {
        const profile = await this.Leaderboard
          .update({ profileId: this.profile.id }, { levelName, score, time, extradata, timestamp: Date.now() })
        profile.save()
        return true
      }
      return false
    } catch (error) {
      logger.error('Error al guardar el puntaje:', error)
    }
  }

  async update (data) {
    try {
      const updatedScore = await this.Leaderboard.updateOne({ profileId: this.profile.id }, data)

      if (updatedScore.nModified > 0) {
        logger.info('Puntaje actualizado exitosamente')
      }
    } catch (error) {
      logger.error('Error al actualizar el puntaje:', error)
    }
  }
}
