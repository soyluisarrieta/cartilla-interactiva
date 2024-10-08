import UIManager from '../components/UIManager.js'
import Attempts from '../components/Attempts.js'
import Slot from '../components/Slot.js'
import Melody from '../components/Melody.js'
import Alert from '../components/Alert.js'
import Socket from '../../../Socket.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
    this.settings = window.gameSettings
    this.exerciseStartTime = null
    this.levelStartTime = null

    this.alert = new Alert(this)
    this.socket = new Socket(this)
  }

  // Método inicial
  init (selectedLevel) {
    this.selectedLevel = selectedLevel ?? 1
    this.screen = this.cameras.main
    this.exercises = []

    this.config = {
      slots: [],
      ...this.settings.levels[selectedLevel - 1]
    }

    this.uiManager = new UIManager(this)
    this.attempts = new Attempts(this)
    this.slot = new Slot(this)
    this.melody = new Melody(this)

    // Generar la melodía aleatoria aquí
    this.generatedMelody = this.melody.generate()

    // Iniciar cronometro
    this.exerciseStartTime = Date.now()
    this.levelStartTime = Date.now()
  }

  // Método principal
  create () {
    this.uiManager.drawBackButton()
    this.uiManager.drawLevelInfo()
    this.uiManager.drawNoteButtons()
    this.uiManager.drawExercises(7)
    this.uiManager.drawActionButtons()
    this.attempts.draw(3)
    this.slot.drawSlots()
    this.slot.selectSlot(this.config.slots[0])
  }

  // Parar cronometro
  calculateElapsedTime (startTime) {
    const endTime = Date.now()
    const elapsedTimeInSeconds = (endTime - startTime) / 1000 // Tiempo en segundos
    return parseFloat(elapsedTimeInSeconds.toFixed(2))
  }
}
