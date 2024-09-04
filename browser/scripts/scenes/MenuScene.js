import { addInteractions } from '/scripts/Utils.js'

class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MenuScene' })
    this.settings = window.gameSettings
  }

  create () {
    const { width: widthScreen, height: heightScreen } = this.cameras.main

    // Imagen de fondo y Logo
    this.add.image(0, 0, 'background')
      .setOrigin(0)
      .setDisplaySize(widthScreen, heightScreen)

    this.add.image(widthScreen / 2, 70, 'logo')
      .setOrigin(0.5, 0)
      .setScale(1.1)

    // Texturas e interacciónes del botón
    const playButton = this.add.image(widthScreen / 2, heightScreen - 230, 'uiMainMenu', 'button')
      .setInteractive()

    addInteractions({
      button: playButton,
      key: 'uiMainMenu',
      frame: 'button',
      onClick: () => {
        this.scene.start('LevelSelectionScene', {
          levels: this.settings.levels
        })
      }
    })
  }
}

export default MenuScene
