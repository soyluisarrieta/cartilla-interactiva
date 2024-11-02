import UIManager from '../components/UIManager.js'
import Slot from '../components/Slot.js'
import Melody from '../components/Melody.js'
import Alert from '../../../core/components/Alert.js'
import Socket from '../../../core/Socket.js'
import UIAnimations from '../../../core/UIAnimations.js'
import Health from '../../../core/components/Health.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })

    this.exerciseStartTime = null
    this.levelStartTime = null

    this.alert = new Alert(this)
    this.socket = new Socket(this)
    this.health = new Health(this)
    this.animations = new UIAnimations(this)
  }

  // Método inicial
  init (level) {
    this.level = level
    this.screen = this.cameras.main
    this.exercises = []

    this.settings = window.gameSettings

    this.config = {
      slots: []
    }

    this.uiManager = new UIManager(this)
    this.slot = new Slot(this)
    this.melody = new Melody(this)
    this.alert = new Alert(this)

    // Generar la melodía aleatoria aquí
    this.generatedMelody = this.melody.generate()

    // Iniciar cronometro
    this.exerciseStartTime = Date.now()
    this.levelStartTime = Date.now()
  }

  // Método principal
  create () {
    this.uiManager.drawExitButton()
    this.uiManager.drawLevelInfo()
    this.uiManager.drawNoteButtons()
    this.uiManager.drawExercises(7)
    this.uiManager.drawActionButtons()
    this.health.draw(3)
    this.slot.drawSlots()
    this.slot.selectSlot(this.config.slots[0])

    this.sound.stopAll()
    this.sound.play('startGame')
  }

  // Parar cronometro
  calculateElapsedTime (startTime) {
    const endTime = Date.now()
    const elapsedTimeInSeconds = (endTime - startTime) / 1000 // Tiempo en segundos
    return parseFloat(elapsedTimeInSeconds.toFixed(2))
  }
}
