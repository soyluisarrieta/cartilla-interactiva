import UIManager from '../components/UIManager.js'
import Attempts from '../components/Attempts.js'
import Slot from '../components/Slot.js'
import Melody from '../components/Melody.js'
import Alert from '../components/Alert.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
    this.settings = window.gameSettings

    this.uiManager = new UIManager(this)
    this.attempts = new Attempts(this)
    this.slot = new Slot(this)
    this.melody = new Melody(this)
    this.alert = new Alert(this)
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

    // Generar la melodía aleatoria aquí
    this.generatedMelody = this.melody.generate()
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
}
