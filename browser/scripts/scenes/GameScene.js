import { mergeObjects, addInteractions } from '/scripts/Utils.js'

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })

    // Configuración predeterminada
    this.config = {
      level: 1
    }
  }

  init (data) {
    this.config = mergeObjects(this.config, data)
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
          levels: {
            name: ['Nivel 1', 'Nivel 3']
          }
        })
      }
    })

    // Crear el contenido del juego aquí
    this.add.bitmapText(widthScreen / 2, 100, 'primaryFont', `Jugando el juego #${this.config.level}`)
      .setOrigin(0.5, 0)
  }
}

export default GameScene
