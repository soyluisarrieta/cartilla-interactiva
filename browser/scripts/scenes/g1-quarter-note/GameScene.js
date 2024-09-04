import { addInteractions } from '/scripts/Utils.js'

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
    this.levelSelected = 1
    this.settings = window.gameSettings
  }

  init (levelSelected) {
    this.levelSelected = levelSelected
  }

  create () {
    const { width: widthScreen, height: heightScreen } = this.cameras.main

    // Botón de ir atrás
    const btnBack = this.add.image(widthScreen / 2, heightScreen - 100, 'uiLvlSelection', 'btn-arrow')
      .setScale(1.5)
      .setOrigin(0.5)
      .setInteractive()

    btnBack.flipX = true

    addInteractions({
      button: btnBack,
      key: 'uiLvlSelection',
      frame: 'btn-arrow',
      onClick: () => {
        this.scene.start('LevelSelectionScene', {
          levels: this.settings.levels
        })
      }
    })

    console.log(this.levelSelected)

    // Crear el contenido del juego aquí
    this.add.bitmapText(widthScreen / 2, 100, 'primaryFont', `Jugando el juego #${this.levelSelected}`)
      .setOrigin(0.5, 0)
  }
}

export default GameScene
