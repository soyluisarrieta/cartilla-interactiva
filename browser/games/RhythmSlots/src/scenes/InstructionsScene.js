import Button from '../../../core/components/Button.js'
import { BUTTONS, SCENES } from '../../../core/constants.js'
import UIAnimations from '../../../core/UIAnimations.js'
import UIManager from '../components/UIManager.js'

export default class InstructionsScene extends Phaser.Scene {
  constructor () {
    super({ key: 'InstructionsScene' })

    this.uiManager = new UIManager(this)
    this.uiAnimations = new UIAnimations(this)
  }

  // Inicial
  init (level) {
    this.level = level
  }

  // Principal
  create () {
    this.drawBackButton()
    this.drawInstructions()
    this.drawStartButton()
  }

  // Botón: Ir atrás
  drawBackButton () {
    Button.draw(this)({
      ...BUTTONS.BACK,
      scene: SCENES.LEVEL_SELECTION,
      position: [150, 120]
    })
  }

  // Título y descripción
  drawInstructions () {
    const { width } = this.cameras.main
    const { title, description, index: levelIndex } = this.level
    const { levels } = window.gameSettings

    this.add
      .bitmapText(width / 2, 70, 'primaryFont', title.toUpperCase(), 70)
      .setOrigin(0.45, 0)

    const uiDescription = this.add
      .bitmapText(1000, 350, 'primaryFont', description, 40)
      .setOrigin(0)
      .setMaxWidth(700)

    this.uiAnimations.fadeIn({ targets: uiDescription, delay: 300 })

    // Obtener figuras musicales nuevas
    const prevLevel = levelIndex === 0 ? { figures: [] } : levels[levelIndex - 1]
    const newFigures = this.level.figures.filter(
      (figure) => !prevLevel.figures.some(
        ({ name }) => figure.exception === true ? false : name === figure.name
      )
    ).reverse()

    // Mostrar las figuras musicales
    newFigures.forEach((newFigure, i) => {
      const fig = this.add.image(800 - (230 * i), 450, newFigure.name)
        .setOrigin(0.5)

      this.uiAnimations.scaleUp({ targets: fig, delay: i * 100 })
    })
  }

  // Crear botón para empezar a jugar
  createPlayButton (screenWidth, screenHeight, selectedLevel) {
    const playButton = this.add.image(screenWidth - 120, screenHeight - 120, 'uiButtons', 'arrow-right')
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.sound.play('soundPress')
        this.scene.start('GameScene', selectedLevel)
      })

    this.uiAnimations.scaleUp({ targets: playButton, delay: 300 })
  }

  // Botón: Empezar juego
  drawStartButton () {
    const { width, height } = this.cameras.main
    const x = width - 120
    const y = height - 120

    Button.draw(this)({
      ...BUTTONS.ARROW_RIGHT,
      position: [x, y],
      onClick: () => {
        this.sound.play('soundPress')
        this.scene.start(SCENES.GAME, this.level)
      }
    })
  }
}
