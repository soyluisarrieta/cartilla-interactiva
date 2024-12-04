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
      const leaderboard = await this.LeaderboardModel.getAll()

      const players = profiles.map((p) => ({
        id: p.id,
        userId: p.userId,
        serial: p.serial,
        username: p.username,
        isOnline: false,
        avatar: p.avatar,
        stats: this.getStats(p.userId, leaderboard)
      }))
      return players
    } catch (error) {
      logger.error('Hubo un error al obtener los mejores puntajes:', error)
      throw error
    }
  }

  getStats (userId, leaderboard) {
    const result = leaderboard.filter(({ profileId }) => profileId === userId)
    if (!result.length) { return [] }

    const separeLevelName = (levelName) => (
      levelName.replace(/[()]/g, '').split(' ').filter(Boolean) ?? [null, null]
    )

    // Juego 7
    if (this.game.id === 'g7-do-the-tones-go-up-or-down') {
      const { _id: id, profileId, ...restStats } = result[0]
      return [{ id, ...restStats }]
    }

    // Juego 11
    if (this.game.id === 'g11-do-scale') {
      return result.map(({ _id: id, profileId, levelName, ...restStats }) => {
        const [separedLevelName, mode] = separeLevelName(levelName)
        return { id, levelName: separedLevelName, mode, ...restStats }
      })
    }

    // Juego 12
    if (this.game.id === 'g12-treble-clef') {
      return result.map(({ _id: id, profileId, levelName, ...restStats }) => {
        const [separedLevelName, sizeNotes] = separeLevelName(levelName)
        const notes = `${sizeNotes} notas`
        return { id, levelName: separedLevelName, notes, ...restStats }
      })
    }

    // Cualquier otro juego
    return result.map(({ _id: id, profileId, ...restStats }) => ({ id, ...restStats }))
  }
}
