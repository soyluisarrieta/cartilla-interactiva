import DBLocal from 'db-local'
import logger from '../lib/winston/logger.js'
import { GAMES, USER_DATA } from '../constants.js'
import { app } from 'electron'

export class GameModel {
  constructor ({ profile, game }) {
    this.profile = profile
    this.game = game
    this.path = `${USER_DATA(app)}/db/games/${game.id}`

    const GAME = GAMES.find(({ id }) => id === this.game.id)

    const { Schema } = new DBLocal({ path: this.path })
    this.Game = Schema(profile.id, GAME.schema)
  }

  async saveLevel (data) {
    try {
      const levelCompleted = await this.Game.create(data)
      await levelCompleted.save()
    } catch (error) {
      logger.error('Error al guardar el nivel:', error)
    }
  }
}
