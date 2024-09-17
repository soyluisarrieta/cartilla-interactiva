import UIManager from '../components/UIManager.js'
import Slot from '../components/Slot.js'
import Melody from '../components/Melody.js'
import Alert from '../components/Alert.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
    this.settings = window.gameSettings

    this.filledSlots = false
    this.btnFinish = null
    this.btnPlayMelody = null
    this.currentExercise = null

    this.melodyState = {
      isPlaying: false,
      timers: []
    }

    this.textureStates = {
      playing: 'button',
      failed: 'button-pressed',
      completed: 'button-hovered'
    }

    this.uiManager = new UIManager(this)
    this.slot = new Slot(this)
    this.melody = new Melody(this)
    this.alert = new Alert(this)
  }

  // Método inicial
  init (selectedLevel) {
    this.intervalIndicators = []
    this.selectedLevel = selectedLevel ?? 1
    this.screen = this.cameras.main

    this.config = {
      slots: [],
      exercises: [],
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
    this.slot.drawSlots()
    this.slot.selectSlot(this.config.slots[0])
  }
}
