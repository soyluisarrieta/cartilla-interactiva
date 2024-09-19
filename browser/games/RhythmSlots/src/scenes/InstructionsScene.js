import { addInteractions } from '../../../utils/addInteractions.js'

export default class InstructionsScene extends Phaser.Scene {
  constructor () {
    super({ key: 'InstructionsScene' })
    this.settings = window.gameSettings
  }

  create () {
    const { width: screenWidth, height: screenHeight } = this.cameras.main
    const selectedLevel = this.settings.selectedLevel

    this.createBackButton(screenWidth, screenHeight)
    this.createHomeButton(screenHeight)
    this.createPlayButton(screenWidth, screenHeight, selectedLevel)
    this.displayInstructions(screenWidth, selectedLevel)
  }

  // Crear botón para regresar a la selección de niveles
  createBackButton (screenWidth, screenHeight) {
    const backButton = this.add.image(screenWidth / 2 - 100, screenHeight - 100, 'uiLvlSelection', 'btn-arrow')
      .setScale(1.5)
      .setOrigin(0.5)
      .setInteractive()

    backButton.flipX = true

    addInteractions({
      button: backButton,
      key: 'uiLvlSelection',
      frame: 'btn-arrow',
      onClick: () => {
        this.scene.start('LevelSelectionScene')
      }
    })
  }

  // Crear botón para ir al menú principal
  createHomeButton (screenHeight) {
    const homeButton = this.add.image(100, screenHeight - 100, 'uiLvlSelection', 'btn-home')
      .setScale(1.5)
      .setOrigin(0.5)
      .setInteractive()

    addInteractions({
      button: homeButton,
      key: 'uiLvlSelection',
      frame: 'btn-home',
      onClick: () => {
        this.scene.start('MenuScene')
      }
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
