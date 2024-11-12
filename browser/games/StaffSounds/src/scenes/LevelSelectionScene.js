import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'

export default class LevelSelectionScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.LEVEL_SELECTION })
  }

  create () {
    const { width, height } = this.cameras.main
    const levels = window.gameSettings.levels

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

    this.add.bitmapText(width / 2, 120, FONTS.PRIMARY, 'Selecciona un modo')
      .setOrigin(0.5)

    // Crear niveles
    const [x, y] = [width / 2, 400]
    this.add
      .image(x - 300, y, 'levels', 'level-easy')
      .setInteractive()
      .on('pointerup', () => this.scene.start(SCENES.GAME, { ...levels[0], index: 0 }))

    this.add
      .image(x, y, 'levels', 'level-medium')
      .setInteractive()
      .on('pointerup', () => this.scene.start(SCENES.GAME, { ...levels[1], index: 1 }))

    this.add
      .image(x + 300, y, 'levels', 'level-hard')
      .setInteractive()
      .on('pointerup', () => this.scene.start(SCENES.GAME, { ...levels[2], index: 2 }))
  }
}
