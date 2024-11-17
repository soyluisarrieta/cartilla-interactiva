import DBLocal from 'db-local'
import path from 'node:path'
import fs from 'node:fs'
import logger from '../lib/winston/logger.js'
import { USER_DATA } from '../constants.js'
import { app } from 'electron'

export class ProfileModel {
  constructor ({ serial }) {
    const userData = app.getPath('userData')
    const dbFolderPath = path.join(userData, 'db', 'profiles')
    if (!fs.existsSync(dbFolderPath)) {
      fs.mkdirSync(dbFolderPath, { recursive: true })
    }
    this.path = `${USER_DATA(app)}/db/profiles`
    const { Schema } = new DBLocal({ path: this.path })
    this.Profile = Schema(serial, {
      _id: { type: String, required: true },
      userId: { type: String, required: true },
      username: { type: String, required: true },
      avatar: { type: String, required: true },
      timestamp: { type: Number, default: Date.now }
    })
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
