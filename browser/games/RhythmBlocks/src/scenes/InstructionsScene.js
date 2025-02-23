import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import UIAnimations from '../../../core/UIAnimations.js'
import UIManager from '../components/UIManager.js'

export default class InstructionsScene extends Phaser.Scene {
  constructor () {
    super({ key: 'InstructionsScene' })

    this.uiManager = new UIManager(this)
    this.animations = new UIAnimations(this)
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
    const { width, height } = this.cameras.main
    const { metrics, title, description } = this.level

    this.add.text(width / 2, 80, title.toUpperCase(), {
      fontSize: '70px',
      fontFamily: FONTS.PRIMARY,
      color: '#ffffff'
    }).setOrigin(0.45, 0)

    const uiImage = this.add
      .image(width / 2, 300, `metric${metrics.name}`)
      .setOrigin(0.5, 0)

    const uiDescription = this.add.text(width / 2, height - 300, description, {
      fontSize: '40px',
      fontFamily: FONTS.SECONDARY,
      color: '#ffffff',
      wordWrap: { width: 700 }
    }).setOrigin(0.5, 0)

    this.animations.fadeIn({ targets: [uiImage, uiDescription], delay: 300 })
  }

  // Botón: Empezar a jugar
  drawStartButton () {
    const { width, height } = this.cameras.main
    const x = width - 120
    const y = height - 120
    const playButton = this.add
      .image(x, y, BUTTONS.ARROW_RIGHT.key, BUTTONS.ARROW_RIGHT.frame)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.start(SCENES.GAME, this.level)
      })

    this.animations.scaleUp({ targets: playButton, delay: 300 })
  }
}
