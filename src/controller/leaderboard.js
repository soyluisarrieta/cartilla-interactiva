import logger from '../lib/winston/logger.js'
import { LeaderboardModel } from '../models/leaderboard.js'

export class LeaderboardController {
  constructor ({ profile, game, socket }) {
    this.socket = socket
    this.profile = profile
    this.game = game
    this.LeaderboardModel = new LeaderboardModel({ profile, game })
  }

  async newScore ({ levelName, score, time, ...extradata }) {
    try {
      const saved = this.LeaderboardModel.save({ levelName, score, time, ...extradata })
      if (!saved) return null
      this.socket.broadcast.emit('updateLeaderboard', {
        ...extradata,
        levelName,
        points: score,
        gameId: this.game.id,
        profile: this.profile
      })
    } catch (error) {
      logger.error('Hubo un error al guardar un nuevo perfil:', error)
      throw error
    }
  }
}
