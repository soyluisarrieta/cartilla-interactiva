import Alert from '../../../core/components/Alert.js'
import Melody from '../../../core/Melody.js'
import UIManager from '../components/UIManager.js'
import UIAnimations from '../../../core/UIAnimations.js'
import { SCENES } from '../../../core/constants.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })

    this.ui = new UIManager(this)
    this.alert = new Alert(this)
    this.melody = new Melody(this)
    this.uiAnimations = new UIAnimations(this)
  }

  // Inicialización
  init (level) {
    this.game = window.gameSettings
    this.level = level
  }

  // Principal
  create () {
    this.ui.init()
    this.start()

    // Sonido de inicio de partida
    this.sound.stopAll()
    this.sound.play('startGame')
  }

  // Iniciar ejercicio
  start () {

  }
}
