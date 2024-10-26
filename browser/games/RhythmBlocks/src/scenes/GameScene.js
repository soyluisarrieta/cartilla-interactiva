import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS } from '../../../core/constants/assets.js'
import { SCENES } from '../constants.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })
  }

  init (selectedLevel) {
  }

  create () {
    const { width } = this.cameras.main

    // Botón: Ir atrás
    Button.draw(this)({
      ...BUTTONS.BACK,
      scene: SCENES.MENU,
      position: [150, 120]
    })

    // Título
    this.add.bitmapText(width / 2, 100, FONTS.PRIMARY, 'GAME SCENE')
      .setOrigin(0.5, 0)
  }
}
