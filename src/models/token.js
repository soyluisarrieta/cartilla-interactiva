import DBLocal from 'db-local'
import path from 'node:path'
import fs from 'node:fs'
import logger from '../lib/winston/logger.js'
import { USER_DATA } from '../constants.js'
import { app } from 'electron'

export class TokenModel {
  constructor () {
    this.path = `${USER_DATA(app)}/db/tokens`
    const { Schema } = new DBLocal({ path: this.path })
    this.Tokens = Schema('tokens', {
      _id: { type: String, required: true },
      token: { type: String, required: true },
      profiles: { type: Array, required: true },
      timestamp: { type: Number, default: Date.now }
    })
  }

  async save ({ token, profiles }) {
    try {

    } catch (error) {
      logger.error('Error al guardar el token de restauración:', error)
    }
  }
}
