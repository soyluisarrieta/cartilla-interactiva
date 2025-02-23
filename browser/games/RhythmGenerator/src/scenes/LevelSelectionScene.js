import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'

export default class LevelSelectionScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.LEVEL_SELECTION })
  }

  create () {
    const { width, height } = this.cameras.main
    this.game = window.gameSettings

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

    this.add.text(width / 2, 120, 'Selecciona un nivel', {
      fontSize: '70px',
      fontFamily: FONTS.PRIMARY,
      color: '#ffffff'
    }).setOrigin(0.5)

    // Crear niveles
    const levels = this.game.levels
    grid({
      totalItems: levels.length,
      item: { width: 500, height: 100 },
      gap: 0,
      position: [500, 300],
      element: ({ x, y }, i) => {
        const onClick = () => this.scene.start(SCENES.GAME, levels[i])

        Button.draw(this)({
          ...BUTTONS.ARROW_RIGHT,
          position: [x, y],
          withSound: false,
          onClick
        }).setScale(0.4)

        this.add.text(x + 50, y, levels[i].title, {
          fontSize: '50px',
          fontFamily: FONTS.SECONDARY,
          color: '#ffffff'
        }).setOrigin(0, 0.5)
          .setInteractive()
          .on('pointerup', onClick)
      }
    })
  }
}
