import logger from '../lib/winston/logger.js'
import path from 'node:path'
import fs from 'node:fs'
import { ProfileModel } from '../models/profile.js'
import { TokenModel } from '../models/token.js'
import { USER_DATA } from '../constants.js'
import { app } from 'electron'

export class TokensController {
  constructor ({ socket }) {
    this.socket = socket
    this.profileModel = new ProfileModel({})
    this.tokenModel = new TokenModel()
  }

  async generate ({ token, serial }) {
    try {
      return await this.tokenModel.save({ generatedToken: token, serial })
    } catch (error) {
      logger.error('Hubo un error al generar el token de restauración:', error)
      throw error
    }
  }

  async getProfilesByToken (token) {
    try {
      const serial = await this.tokenModel.getSerial(token)
      if (!serial) { return { error: 'El token de restauración fue inválido.' } }
      if (serial.error) { return serial }
      const profileModel = new ProfileModel({ serial })
      const profiles = await profileModel.getAllBySerial()
      const profilesWithGames = await Promise.all(
        profiles.map(async ({ avatar, userId: id, username, timestamp }) => {
          const games = this.getGamesByProfile(id)
          const lastTime = new Date(timestamp).toLocaleString()
          return { avatar, id, username, serial, games, lastTime }
        })
      )
      return profilesWithGames
    } catch (error) {
      logger.error('Hubo un error al obtener los perfiles usando el token de restauración:', error)
      throw error
    }
  }

  getGamesByProfile (profileId) {
    try {
      const basePath = `${USER_DATA(app)}/db/games`
      const gameFolders = fs.readdirSync(basePath)
      const gamesObj = {}

      for (const folder of gameFolders) {
        const folderPath = path.join(basePath, folder)
        if (fs.statSync(folderPath).isDirectory()) {
          const profileFile = path.join(folderPath, `${profileId}.json`)
          const defaultLevels = folder.match(/g1[1-5]/)
            ? ['Escribir', 'Leer', 'Escuchar']
            : ['easy', 'medium', 'hard']

          if (fs.existsSync(profileFile)) {
            const data = JSON.parse(fs.readFileSync(profileFile, 'utf-8'))
            if (folder === 'g7-do-the-tones-go-up-or-down') {
              gamesObj[folder] = { bestScore: data[0].bestScore, levels: [] }
              continue
            }

            const completedLevels = data.map(({ level }) => {
              let name = level?.name ?? 'unique'
              if (
                folder === 'g11-do-scale' ||
                folder === 'g12-treble-clef' ||
                folder === 'g13-major-scales' ||
                folder === 'g14-chromatic-scales' ||
                folder === 'g15-major-and-minor-scales'
              ) {
                name = this.getParsedLevelName(name)
              }
              return { name, completed: true }
            })

            const allLevels = defaultLevels.map(levelName => {
              const completedLevel = completedLevels.find(l => l.name === levelName)
              return completedLevel || { name: levelName }
            })

            gamesObj[folder] = { levels: allLevels }
          } else {
            gamesObj[folder] = {
              levels: defaultLevels.map(name => ({ name }))
            }
          }
        }
      }
      return gamesObj
    } catch (error) {
      logger.error('Error al obtener los datos de los juegos por perfil:', error)
      return []
    }
  }

  getParsedLevelName (levelName) {
    const [separedLevelName] = levelName.replace(/[()]/g, '').split(' ').filter(Boolean) ?? [null, null]
    return separedLevelName
  }
}
