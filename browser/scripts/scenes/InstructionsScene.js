import { mergeObjects, addInteractions } from '/scripts/Utils.js'

class InstructionsScene extends Phaser.Scene {
  constructor () {
    super({ key: 'InstructionsScene' })

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
    const btnBack = this.add.image(widthScreen / 2 - 100, heightScreen - 100, 'uiLvlSelection', 'btn-arrow')
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

    // Botón de inicio
    const btnHome = this.add.image(100, heightScreen - 100, 'uiLvlSelection', 'btn-home')
      .setScale(1.5)
      .setOrigin(0.5)
      .setInteractive()

    addInteractions({
      button: btnHome,
      key: 'uiLvlSelection',
      frame: 'btn-home',
      onClick: () => {
        this.scene.start('MenuScene')
      }
    })

    // Botón de jugar
    const btnPlayGame = this.add.image(widthScreen / 2 + 100, heightScreen - 100, 'uiLvlSelection', 'btn-arrow')
      .setScale(1.5)
      .setOrigin(0.5)
      .setInteractive()

    addInteractions({
      button: btnPlayGame,
      key: 'uiLvlSelection',
      frame: 'btn-arrow',
      onClick: () => {
        this.scene.start('GameScene', this.config)
      }
    })

    // Crear el contenido del juego aquí
    this.add.bitmapText(widthScreen / 2, 100, 'primaryFont', `Instrucciones del juego #${this.config.level}`)
      .setOrigin(0.5, 0)
  }
}

export default InstructionsScene
