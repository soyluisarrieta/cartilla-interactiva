import { addInteractions } from '../../../utils/addInteractions.js'

export default class LevelSelectionScene extends Phaser.Scene {
  constructor () {
    super({ key: 'LevelSelectionScene' })
    this.settings = window.gameSettings
  }

  create () {
    const { width: widthScreen, height: heightScreen } = this.cameras.main

    const levels = this.settings.levels
    const numLevels = levels.length

    // Imagen de fondo
    this.add.image(0, 0, 'background')
      .setOrigin(0)
      .setDisplaySize(widthScreen, heightScreen)

    // Título
    this.add.image(widthScreen / 2, 50, 'uiLvlSelection', 'bg-title')
      .setScale(1.5)
      .setOrigin(0.5, 0)

    this.add.bitmapText(widthScreen / 2, 65, 'primaryFont', 'Selecciona un nivel')
      .setOrigin(0.5, 0)

    // Niveles
    const totalWidth = numLevels * 200 + (numLevels - 1) * 100
    const startX = (widthScreen - totalWidth) / 2 + 200 / 2

    const position = { x: startX, y: 400 }

    for (let i = 0; i < numLevels; i++) {
      const level = levels[i]
      const isLevelLocked = Boolean(i !== 0 && !levels[i - 1].isCompleted)
      const levelStatus = level.isCompleted ? '-completed' : isLevelLocked ? '-locked' : ''
      const texture = `level-${level.name + levelStatus}`
      const levelButton = this.add.image(position.x, position.y, 'levels', texture)
        .setOrigin(0.5, 0.5)
        .setInteractive()

      !isLevelLocked && addInteractions({
        button: levelButton,
        key: 'levels',
        frame: `level-${level.name + levelStatus}`,
        onClick: () => {
          window.gameSettings.selectedLevel = i + 1
          this.scene.start('InstructionsScene')
        }
      })

      position.x += 200 + 100

      // Definir id de cada nivel
      if (level.id === undefined) {
        level.id = i
      }
    }

    // Botón de inicio
    const btnHome = this.add.image(widthScreen / 2, heightScreen - 220, 'uiLvlSelection', 'btn-home')
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
