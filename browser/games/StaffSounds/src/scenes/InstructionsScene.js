import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import UIAnimations from '../../../core/UIAnimations.js'

export default class InstructionsScene extends Phaser.Scene {
  constructor () {
    super({ key: 'InstructionsScene' })
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
    const { width } = this.cameras.main
    this.add.text(width / 2, 70, 'Instrucciones', {
      fontSize: '70px',
      fontFamily: FONTS.PRIMARY,
      color: '#ffffff'
    }).setOrigin(0.45, 0)
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
