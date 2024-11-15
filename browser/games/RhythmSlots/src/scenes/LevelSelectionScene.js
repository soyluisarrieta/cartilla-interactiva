import Button from '../../../core/components/Button.js'
import Levels from '../../../core/components/Levels.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'

export default class LevelSelectionScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.LEVEL_SELECTION })
    this.levels = new Levels(this)
  }

  create () {
    const { width, height } = this.cameras.main

    // Imagen de fondo
    this.add.image(0, 0, 'bgMenu')
      .setOrigin(0)
      .setDisplaySize(width, height)

    // Botón: Ir atrás
    Button.draw(this)({
      ...BUTTONS.BACK,
      scene: SCENES.MENU,
      position: [150, 120]
    })

    // Título
    this.add.image(width / 2, 120, 'bannerTitle')
      .setOrigin(0.5)

    this.add.bitmapText(width / 2, 120, FONTS.PRIMARY, 'Selecciona un nivel')
      .setOrigin(0.5)

    // Crear niveles
    const levels = window.gameSettings.levels
    if (levels.length === 1) {
      this.scene.start(SCENES.INSTRUCTIONS, levels[0])
      return null
    }
    this.levels.init()
  }
}
