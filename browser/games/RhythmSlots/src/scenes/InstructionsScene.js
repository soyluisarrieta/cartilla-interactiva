import { getProfile } from '../../../../scripts/Profile.js'
import { addInteractions } from '../../../utils/addInteractions.js'
import UIManager from '../components/UIManager.js'

export default class InstructionsScene extends Phaser.Scene {
  constructor () {
    super({ key: 'InstructionsScene' })

    this.uiManager = new UIManager(this)
  }

  create () {
    const { width: screenWidth, height: screenHeight } = this.cameras.main

    const profile = getProfile()
    const { selectedLevel } = profile
    const { levels } = profile.games[window.gameSettings.id]

    const prevLevel = this.getPreviousLevel(selectedLevel, levels)
    const currentLevel = levels[selectedLevel - 1]
    const newFigures = this.getNewFigures(currentLevel, prevLevel)

    this.drawUI(screenWidth, currentLevel.title, currentLevel.description, newFigures)
    this.createPlayButton(screenWidth, screenHeight, selectedLevel)
  }

  getPreviousLevel (selectedLevel, levels) {
    return selectedLevel === 1 ? { figures: [] } : levels[selectedLevel - 2]
  }

  getNewFigures (currentLevel, prevLevel) {
    return currentLevel.figures.filter(
      (figure) => !prevLevel.figures.some(prevFigure => prevFigure.name === figure.name)
    ).reverse()
  }

  drawUI (screenWidth, title, description, newFigures) {
    this.uiManager.drawBackButton('LevelSelectionScene')

    this.add.bitmapText(screenWidth / 2, 70, 'primaryFont', title.toUpperCase(), 70)
      .setOrigin(0.45, 0)

    this.add.bitmapText(screenWidth - 600, 450, 'primaryFont', description, 40)
      .setOrigin(0.5)
      .setMaxWidth(650)

    newFigures.forEach((newFigure, i) => {
      this.add.image(800 - (230 * i), 450, newFigure.name)
        .setOrigin(0.5)
    })
  }

  // Crear botón para empezar a jugar
  createPlayButton (screenWidth, screenHeight, selectedLevel) {
    const playButton = this.add.image(screenWidth / 2 + 100, screenHeight - 100, 'uiLvlSelection', 'btn-arrow')
      .setScale(1.5)
      .setOrigin(0.5)
      .setInteractive()

    addInteractions({
      button: playButton,
      key: 'uiLvlSelection',
      frame: 'btn-arrow',
      onClick: () => {
        this.sound.play('soundPress')
        this.scene.start('GameScene', selectedLevel)
      }
    })
  }
}
