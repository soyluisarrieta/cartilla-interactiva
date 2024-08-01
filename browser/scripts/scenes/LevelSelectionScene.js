import { addInteractions } from '/scripts/Utils.js'

class LevelSelectionScene extends Phaser.Scene {
  constructor () {
    super({ key: 'LevelSelectionScene' })
  }

  create () {
    const { width, height } = this.cameras.main

    // Mostrar imagen de fondo
    this.add.image(0, 0, 'background')
      .setOrigin(0)
      .setDisplaySize(width, height)

    // Título
    this.add.image(width / 2, 30, 'uiLvlSelection', 'bg-title')
      .setScale(1.5)
      .setOrigin(0.5, 0)

    this.add.bitmapText(width / 2, 45, 'primaryFont', 'Selecciona un nivel')
      .setOrigin(0.5, 0)

    // Boton de inicio
    const btnHome = this.add.image(width / 2, height - 230, 'uiLvlSelection', 'btn-home')
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
  }
}

export default LevelSelectionScene
