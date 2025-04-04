import UIManager from '../components/UIManager.js'
import Slot from '../components/Slot.js'
import Alert from '../../../core/components/Alert.js'
import Socket from '../../../core/Socket.js'
import UIAnimations from '../../../core/UIAnimations.js'
import Health from '../../../core/components/Health.js'
import Melody from '../../../core/Melody.js'
import Exercises from '../../../core/components/Exercises.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })

    this.exerciseStartTime = null
    this.levelStartTime = null

    this.alert = new Alert(this)
    this.health = new Health(this)
    this.exercises = new Exercises(this)
    this.melody = new Melody(this)
    this.socket = new Socket(this)
    this.uiAnimations = new UIAnimations(this)
  }

  // Método inicial
  init (level) {
    this.level = level
    this.game = window.gameSettings
    this.screen = this.cameras.main
    this.settings = window.gameSettings
    this.slots = []

    this.ui = new UIManager(this)
    this.slot = new Slot(this)
    this.alert = new Alert(this)

    // Iniciar cronometro
    this.levelStartTimer = Date.now()
  }

  // Método principal
  create () {
    const { width: widthScreen, height: heightScreen } = this.cameras.main

    // Imagen de fondo, banner y Logo
    this.add
      .image(0, 0, 'bgGameScene')
      .setOrigin(0)
      .setDisplaySize(widthScreen, heightScreen)

    this.add
      .image(0, 10, 'bannerGameScene')
      .setOrigin(0)

    this.ui.init()
    this.health.draw(3)
    this.exercises.create(7)
    this.slot.drawSlots()
    this.slot.selectSlot(this.slots[0])

    this.sound.stopAll()
    this.sound.play('startGame')

    // Generar una melodía aleatoria
    this.melody.generate(this.level.figures, this.level.maxSlots)
    this.exercises.play(0)
  }
}
