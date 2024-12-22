import DBLocal from 'db-local'
import path from 'node:path'
import fs from 'node:fs'
import logger from '../lib/winston/logger.js'
import { USER_DATA } from '../constants.js'
import { app } from 'electron'

export class ProfileModel {
  constructor ({ serial = null }) {
    this.path = `${USER_DATA(app)}/db/profiles`

    const userData = app.getPath('userData')
    const dbFolderPath = path.join(userData, 'db', 'profiles')
    if (!fs.existsSync(dbFolderPath)) {
      fs.mkdirSync(dbFolderPath, { recursive: true })
    }

    if (!serial) { return null }

    const { Schema } = new DBLocal({ path: this.path })
    this.Profile = Schema(serial, {
      _id: { type: String, required: true },
      userId: { type: String, required: true },
      username: { type: String, required: true },
      playing: { type: String, default: '' },
      isOnline: { type: Boolean, default: false },
      avatar: { type: String, required: true },
      timestamp: { type: Number, default: Date.now }
    })
  }

  async setOnline (userId, isOnline, props = {}) {
    try {
      const profile = await this.Profile.update({ userId }, { isOnline, ...props })
      profile.save()
    } catch (error) {
      logger.error('Error al definir conexión de uno o varios perfiles:', error)
    }
  }

  getAll () {
    try {
      const files = fs.readdirSync(this.path)
      let profiles = []

      for (const file of files) {
        const filePath = path.join(this.path, file)
        if (fs.statSync(filePath).isFile() && file.endsWith('.json')) {
          const serial = path.basename(file, '.json')
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
          profiles = profiles.concat(
            data.map(({ _id: id, ...profile }) => ({
              id,
              serial,
              ...profile
            }))
          )
        }
      }

      return profiles
    } catch (error) {
      logger.error('Error al obtener los perfiles:', error)
      return []
    }
  }

  async getAllBySerial () {
    try {
      const profiles = await this.Profile.find()
      return profiles.map(({ _id: id, ...profile }) => ({ id, ...profile }))
    } catch (error) {
      logger.error('Error al obtener los perfiles por serial:', error)
      return []
    }
  }

  async save (data) {
    try {
      const exists = await this.Profile.findOne({ userId: data.userId })
      if (exists) return null
      const profile = await this.Profile.create(data)
      await profile.save()
    } catch (error) {
      logger.error('Error al guardar el perfil:', error)
    }
  }
}
