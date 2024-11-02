import Melody from '../../../core/Melody.js'
import UIManager from '../components/UIManager.js'
import { SCENES } from '../../../core/constants.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })

    this.ui = new UIManager(this)
    this.melody = new Melody(this)
  }

  // Inicialización
  init (level) {
    this.game = window.gameSettings
    this.level = this.game.levels[0]
    console.log(this.level)

    this.generatedMelody = null

    UIManager.title = this.level.title
  }

  // Principal
  create () {
    this.start()

    // Sonido de inicio de partida
    this.sound.stopAll()
    this.sound.play('startGame')
  }

  // Iniciar ejercicio
  start () {
    const { figures, metrics } = this.level
    const maxFigures = metrics.compass * metrics.figures
    this.generatedMelody = this.melody.generate(figures, maxFigures)
    console.log(this.generatedMelody)
  }
}
