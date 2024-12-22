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
        profiles.map(async (profile) => {
          const games = this.getGamesByProfile(profile.userId)
          return {
            ...profile,
            games
          }
        })
      )
      console.log(profilesWithGames[0].games)

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
      let games = []

      for (const folder of gameFolders) {
        const folderPath = path.join(basePath, folder)
        if (fs.statSync(folderPath).isDirectory()) {
          const profileFile = path.join(folderPath, `${profileId}.json`)
          if (fs.existsSync(profileFile)) {
            const data = JSON.parse(fs.readFileSync(profileFile, 'utf-8'))
            games = games.concat(data)
          }
        }
      }

      return games
    } catch (error) {
      logger.error('Error al obtener los datos de los juegos por perfil:', error)
      return []
    }
  }
}
