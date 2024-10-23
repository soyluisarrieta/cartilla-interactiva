import DBLocal from 'db-local'
import logger from '../lib/winston/logger.js'

export class GameModel {
  constructor ({ profile, game }) {
    this.profile = profile
    this.game = game
    this.path = `db/games/${game.id}`

    const { Schema } = new DBLocal({ path: this.path })
    this.Game = Schema(profile.id, {
      _id: { type: String, required: true },
      level: {
        name: { type: String, required: true },
        totalTimer: { type: Number, required: true }
      },
      exercises: { type: Array, required: true },
      timestamp: { type: Number, default: Date.now }
    })
  }

  async saveLevel ({ level, exercises }) {
    try {
      const data = { level, exercises }
      const levelCompleted = await this.Game.create(data)
      await levelCompleted.save()
    } catch (error) {
      logger.error('Error al guardar el nivel:', error)
    }
  }
}
