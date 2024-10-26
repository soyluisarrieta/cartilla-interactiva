import Button from '../../../core/components/Button.js'
import { ASSETS } from '../../../core/constants/assets.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  init (selectedLevel) {
  }

  create () {
    const { width } = this.cameras.main

    // Botón: Ir atrás
    Button.draw(this)({
      ...ASSETS.BUTTONS.BACK,
      scene: 'MenuScene',
      position: [150, 120]
    })

    // Título
    this.add.bitmapText(width / 2, 100, 'primaryFont', 'GAME SCENE')
      .setOrigin(0.5, 0)
  }
}
