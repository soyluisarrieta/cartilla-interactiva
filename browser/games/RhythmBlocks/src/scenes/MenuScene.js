import Button from '../../../core/components/Button.js'
import { BUTTONS, IMAGES } from '../../../core/constants/assets.js'
import UIAnimations from '../../../core/UIAnimations.js'
import { SCENES } from '../constants.js'

export default class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.MENU })
    this.animations = new UIAnimations(this)
  }

  create () {
    const { width, height } = this.cameras.main

    // Imagen de fondo
    this.add.image(0, 0, IMAGES.BG_MENU)
      .setOrigin(0)
      .setDisplaySize(width, height)

    // Logo del juego
    this.add.image(width / 2, 70, IMAGES.GAME_LOGO)
      .setOrigin(0.5, 0)
      .setScale(1.1)

    // Botón: Iniciar juego
    const btnStart = Button.draw(this)({
      ...BUTTONS.START_GAME,
      scene: SCENES.GAME,
      position: [width / 2.6, height - 270]
    })

    this.animations.scaleUp({
      targets: btnStart,
      duration: 400,
      delay: 50,
      endScale: 0.9
    })

    // Botón: Cómo jugar
    const btnHowToPlay = Button.draw(this)({
      ...BUTTONS.HOW_TO_PLAY,
      scene: SCENES.HOW_TO_PLAY,
      position: [width / 1.64, height - 270]
    })

    this.animations.scaleUp({
      targets: btnHowToPlay,
      duration: 400,
      endScale: 0.9
    })
  }
}
