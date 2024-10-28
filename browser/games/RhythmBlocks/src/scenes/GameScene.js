import { getProfile } from '../../../../scripts/Profile.js'
import Button from '../../../core/components/Button.js'
import { SCENES, BUTTONS, FONTS } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'
import { Block } from '../components/Block.js'
import { Slot } from '../components/Slot.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })
    this.slots = []
    this.blocks = []
  }

  // Inicialización
  init () {
    const selectedLevel = 0
    const profile = getProfile()
    this.game = profile.playing
    this.level = profile.playing.levels[selectedLevel]
  }

  // Principal
  create () {
    this.backButton()
    this.setTitle('GAME SCENE')
    this.drawBlocks()
    this.drawSlots()
  }

  // Botón: Ir atrás
  backButton () {
    Button.draw(this)({
      ...BUTTONS.BACK,
      scene: SCENES.MENU,
      position: [150, 120]
    })
  }

  // Títular
  setTitle (text) {
    const { width } = this.cameras.main
    return this.add
      .bitmapText(width / 2, 100, FONTS.PRIMARY, text)
      .setOrigin(0.5, 0)
  }

  // Implementar bloques
  drawBlocks () {
    const totalBlocks = this.level.metrics.blocks
    grid({
      totalItems: totalBlocks,
      item: { width: 340, height: 200 },
      maxColumns: 3,
      gap: 40,
      position: [170, 250],
      element: ({ x, y }) => {
        const block = new Block(this)
        block.draw({ x, y, size: 2 })
        this.blocks.push(block)
      }
    })
  }

  // Implementar slots
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
        const slot = new Slot(this)
        slot.draw({ x, y, size: 2 })
        this.slots.push(slot)
      }
    })
  }
}
