import { getProfile, setProfile } from '../../../../scripts/Profile.js'
import { addInteractions } from '../../../utils/addInteractions.js'
import UIManager from '../components/UIManager.js'

export default class LevelSelectionScene extends Phaser.Scene {
  constructor () {
    super({ key: 'LevelSelectionScene' })
    this.uiManager = new UIManager(this)
  }

  create () {
    const { width: widthScreen, height: heightScreen } = this.cameras.main

    // Cargar el progreso del juego
    const profile = getProfile()
    const currentGame = profile.games[window.gameSettings.id]

    const levels = currentGame ? currentGame.levels : currentGame.levels
    const numLevels = levels.length

    // Imagen de fondo
    this.add.image(0, 0, 'background')
      .setOrigin(0)
      .setDisplaySize(widthScreen, heightScreen)

    // Botón ir atrás
    this.uiManager.drawBackButton('MenuScene')

    // Título
    this.add.image(widthScreen / 2, 120, 'bannerTitle')
      .setOrigin(0.5)

    this.add.bitmapText(widthScreen / 2, 120, 'primaryFont', 'Selecciona un nivel')
      .setOrigin(0.5)

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
          profile.selectedLevel = i + 1
          setProfile(profile)
          this.sound.play('soundPress')
          this.scene.start('InstructionsScene')
        }
      })

      position.x += 200 + 100

      // Definir id de cada nivel
      if (level.id === undefined) {
        level.id = i
      }
    }
  }
}
