import { addInteractions } from '../../../utils/addInteractions.js'

export default class HowToPlayScene extends Phaser.Scene {
  constructor () {
    super({ key: 'HowToPlayScene' })
    this.settings = window.gameSettings
  }

  create () {
    this.createBackButton()
    this.displayInstructions()
  }

  // Crear botón para regresar a la selección de niveles
  createBackButton () {
    const { height: screenHeight } = this.cameras.main
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

  // Mostrar las instrucciones del juego
  displayInstructions () {
    const { width: screenWidth } = this.cameras.main
    this.add.bitmapText(screenWidth / 2, 100, 'primaryFont', '¡Cómo jugar!')
      .setOrigin(0.5, 0)
  }
}
