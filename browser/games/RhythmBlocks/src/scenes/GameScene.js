import { getProfile } from '../../../../scripts/Profile.js'
import Button from '../../../core/components/Button.js'
import { SCENES, BUTTONS, FONTS } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'
import { UI } from '../constants.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })
  }

  init () {
    const selectedLevel = 0
    const profile = getProfile()
    this.game = profile.playing
    this.level = profile.playing.levels[selectedLevel]
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

    // UI
    this.drawBlocks()
    this.drawSlots()
  }

  // Blocks
  drawBlocks () {
    const totalBlocks = this.level.metrics.blocks

    grid({
      totalItems: totalBlocks,
      item: { width: 340, height: 200 },
      maxColumns: 3,
      gap: 40,
      position: [170, 250],
      element: ({ x, y }) => {
        this.add.image(x, y, UI.BLOCKS.KEY, UI.BLOCKS.BLOCK(2))
          .setScale(0.6)
          .setOrigin(0)
      }
    })
  }

  // Slots
  drawSlots () {
    const { height } = this.cameras.main
    const totalSlots = this.level.metrics.slots

    grid({
      totalItems: totalSlots,
      item: { width: 400, height: 200 },
      maxColumns: 4,
      gap: 40,
      position: [90, height - 50],
      element: ({ x, y }) => {
        this.add.image(x, y, UI.BLOCKS.KEY, UI.BLOCKS.SLOT(2))
          .setScale(0.7)
          .setOrigin(0, 1)
      }
    })
  }
}
