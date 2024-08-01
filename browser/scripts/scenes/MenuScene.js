import { addInteractions } from '/scripts/Utils.js'

class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MenuScene' })
  }

  create () {
    const { width, height } = this.cameras.main

    // Imagen de fondo y Logo
    this.add.image(0, 0, 'background')
      .setOrigin(0)
      .setDisplaySize(width, height)

    this.add.image(width / 2, 40, 'uiMainMenu', 'logo')
      .setOrigin(0.5, 0)
      .setScale(1.6)

    // Texturas e interacciónes del botón
    const playButton = this.add.image(width / 2, height - 230, 'uiMainMenu', 'button')
      .setInteractive()

    addInteractions({
      button: playButton,
      key: 'uiMainMenu',
      frame: 'button',
      onClick: () => {
        this.scene.start('LevelSelectionScene')
      }
    })
  }
}

export default MenuScene
