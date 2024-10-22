import { addInteractions } from '../../../utils/addInteractions.js'
import UIManager from '../components/UIManager.js'

export default class InstructionsScene extends Phaser.Scene {
  constructor () {
    super({ key: 'InstructionsScene' })
    this.settings = window.gameSettings

    this.uiManager = new UIManager(this)
  }

  create () {
    const { width: screenWidth, height: screenHeight } = this.cameras.main
    const selectedLevel = this.settings.selectedLevel

    this.uiManager.drawBackButton('LevelSelectionScene')

    this.createPlayButton(screenWidth, screenHeight, selectedLevel)
    this.displayInstructions(screenWidth, selectedLevel)
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
        this.scene.start('GameScene', selectedLevel)
      }
    })
  }

  // Mostrar las instrucciones del juego
  displayInstructions (screenWidth, selectedLevel) {
    this.add.bitmapText(screenWidth / 2, 100, 'primaryFont', `Instrucciones del juego #${selectedLevel}`)
      .setOrigin(0.5, 0)
  }
}
