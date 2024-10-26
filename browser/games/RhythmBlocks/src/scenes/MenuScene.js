import Button from '../../../core/components/Button.js'
import UIAnimations from '../../../core/UIAnimations.js'

export default class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MenuScene' })
    this.animations = new UIAnimations(this)
  }

  create () {
    const { width, height } = this.cameras.main

    // Imagen de fondo
    this.add.image(0, 0, 'bgMenu')
      .setOrigin(0)
      .setDisplaySize(width, height)

    // Logo del juego
    this.add.image(width / 2, 70, 'gameLogo')
      .setOrigin(0.5, 0)
      .setScale(1.1)

    // Botón: Iniciar juego
    const btnStart = Button.draw(this)({
      key: 'btnStart',
      frame: 'start-btn',
      scene: 'LevelSelectionScene',
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
      key: 'btnHowToPlay',
      frame: 'how-to-play-btn',
      scene: 'HowToPlayScene',
      position: [width / 1.64, height - 270]
    })

    this.animations.scaleUp({
      targets: btnHowToPlay,
      duration: 400,
      endScale: 0.9
    })
  }
}
