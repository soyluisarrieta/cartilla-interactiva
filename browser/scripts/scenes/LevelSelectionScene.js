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
    this.add.image(width / 2, 50, 'uiLvlSelection', 'bg-title')
      .setScale(1.5)
      .setOrigin(0.5, 0)

    this.add.bitmapText(width / 2, 65, 'primaryFont', 'Selecciona un nivel')
      .setOrigin(0.5, 0)

    // Niveles
    const levels = 2
    const levelWidth = 200
    const gap = 100
    const totalWidth = levels * levelWidth + (levels - 1) * gap
    const startX = (width - totalWidth) / 2 + levelWidth / 2

    const position = { x: startX, y: 400 }

    for (let i = 0; i < levels; i++) {
      const levelButton = this.add.image(position.x, position.y, 'uiLvlSelection', 'btn-arrow')
        .setScale(2)
        .setOrigin(0.5, 0.5)
        .setInteractive()

      this.add.bitmapText(position.x, position.y + 120, 'primaryFont', `Nivel ${i + 1}`)
        .setOrigin(0.5, 0.5)
        .setScale(0.5)

      addInteractions({
        button: levelButton,
        key: 'uiLvlSelection',
        frame: 'btn-arrow',
        onClick: () => {
          this.scene.start('GameScene', { level: i + 1 })
        }
      })

      position.x += levelWidth + gap
    }

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
