import logger from '../lib/winston/logger.js'
import { LeaderboardModel } from '../models/leaderboard.js'
import { ProfileModel } from '../models/profile.js'

export class LeaderboardController {
  constructor ({ profile, game, socket }) {
    this.socket = socket
    this.profile = profile
    this.game = game
    this.LeaderboardModel = new LeaderboardModel({ profile, game })
    this.profileModel = new ProfileModel({})
  }

  async newScore ({ levelName, score, time, ...extradata }) {
    try {
      const saved = await this.LeaderboardModel.save({ levelName, score, time, ...extradata })
      if (!saved) return null
      const leaderboard = await new LeaderboardController({ game: this.game }).getAllScores()
      this.socket.broadcast.emit('leaderboard', leaderboard)
    } catch (error) {
      logger.error('Hubo un error al guardar un nuevo perfil:', error)
      throw error
    }
  }

  async getAllScores () {
    try {
      const profiles = this.profileModel.getAll()
      const leadeboard = await this.LeaderboardModel.getAll()
      const getStats = (userId) => {
        const result = leadeboard.filter(({ profileId }) => profileId === userId)
        if (!result.length) { return [] }
        return result.map(({ _id: id, profileId, ...restStats }) => ({ id, ...restStats }))
      }

      const players = profiles.map((p) => ({
        id: p.id,
        userId: p.userId,
        serial: p.serial,
        username: p.username,
        isOnline: false,
        avatar: p.avatar,
        stats: getStats(p.userId)
      }))
      return players
    } catch (error) {
      logger.error('Hubo un error al obtener los mejores puntajes:', error)
      throw error
    }
  }
}
