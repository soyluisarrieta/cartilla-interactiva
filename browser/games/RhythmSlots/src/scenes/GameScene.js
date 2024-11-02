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

    // Generar una melodía aleatoria
    this.melody.generate(level.figures, level.maxSlots)

    // Iniciar cronometro
    this.levelStartTime = Date.now()
  }

  // Método principal
  create () {
    this.ui.init()
    this.exercises.create(7)
    this.health.draw(3)
    this.slot.drawSlots()
    this.slot.selectSlot(this.slots[0])

    this.sound.stopAll()
    this.sound.play('startGame')

    this.exercises.play(0)
  }
}
