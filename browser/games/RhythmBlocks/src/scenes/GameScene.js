import { getProfile } from '../../../../scripts/Profile.js'
import Button from '../../../core/components/Button.js'
import { SCENES, BUTTONS, FONTS } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'
import { Block } from '../components/Block.js'
import { Melody } from '../components/Melody.js'
import { Slot } from '../components/Slot.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })
    this.melody = new Melody(this)
  }

  // Inicialización
  init () {
    const selectedLevel = 0
    const profile = getProfile()
    this.game = profile.playing
    this.level = profile.playing.levels[selectedLevel]
    this.slots = []
    this.blocks = []
  }

  // Principal
  create () {
    this.backButton()
    this.setTitle('GAME SCENE')
    this.explanation('Escucha la melodía, arrastra cada parte de la melodía en su casilla correspondiente.')
    this.melodyButton()
    this.confirmButton()
    this.drawBlocks()
    this.drawSlots()
  }

  // Explicación corta
  explanation (text) {
    const { width } = this.cameras.main
    this.add
      .bitmapText(width - 70, 450, FONTS.SECONDARY, text, 38)
      .setOrigin(1)
      .setMaxWidth(500)
  }

  // Botón: Reproducir melodía
  melodyButton () {
    const { tempo } = this.game
    const { figures, metrics } = this.level
    const numFigures = metrics.figures * metrics.slots
    const generatedMelody = this.melody.generate(figures, numFigures)

    const x = this.cameras.main.width - 410
    const y = 600

    const label = this.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Melodía', 32)
      .setOrigin(0.5)

    Button.draw(this)({
      ...BUTTONS.LIST_MELODY,
      position: [x, y],
      withInteractions: false,
      onClick: async ({ button }) => {
        if (!this.melody.isPlaying) {
          label.setText('Parar')
          button.setTexture(BUTTONS.REPEAT.key, BUTTONS.REPEAT.frame)
          await this.melody.play(generatedMelody, tempo)
        }
        this.melody.stop()
        label.setText('Melodía')
        button.setTexture(BUTTONS.LIST_MELODY.key, BUTTONS.LIST_MELODY.frame)
      }
    })
  }

  // Botón: Confirmar melodía
  confirmButton () {
    const x = this.cameras.main.width - 210
    const y = 600

    Button.draw(this)({
      ...BUTTONS.PLAY,
      position: [x, y]
    })

    this.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Confirmar', 32)
      .setOrigin(0.5)
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
  async drawBlocks () {
    const { figures, metrics } = this.level

    grid({
      totalItems: metrics.blocks,
      item: { width: 340, height: 200 },
      maxColumns: 3,
      gap: 40,
      position: [170, 250],
      element: ({ x, y }) => {
        const block = new Block(this)
        block.draw({ x, y, size: metrics.figures })
        block.setFigures(figures, metrics.figures)
        this.blocks.push(block)
      }
    })
  }

  // Implementar slots
  drawSlots () {
    const { height } = this.cameras.main
    const { metrics } = this.level

    grid({
      totalItems: metrics.slots,
      item: { width: 400, height: 200 },
      maxColumns: 4,
      gap: 40,
      position: [90, height - 50],
      element: ({ x, y }) => {
        const slot = new Slot(this)
        slot.draw({ x, y, size: metrics.figures })
        this.slots.push(slot)
      }
    })
  }
}
