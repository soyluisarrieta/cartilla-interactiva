import Block from '../components/Block.js'
import Melody from '../components/Melody.js'
import Slot from '../components/Slot.js'
import UIManager from '../components/UIManager.js'
import Alert from '../../../core/Alert.js'
import Health from '../../../core/components/Health.js'
import { getProfile } from '../../../../scripts/Profile.js'
import { SCENES } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })
    this.ui = new UIManager(this)
    this.alert = new Alert(this)
    this.melody = new Melody(this)
    this.health = new Health(this)
  }

  // Inicialización
  init () {
    const selectedLevel = 0
    const profile = getProfile()
    this.game = profile.playing
    this.selectedLevel = selectedLevel
    this.level = profile.playing.levels[selectedLevel]
    this.slots = []
    this.blocks = []
  }

  // Principal
  create () {
    this.ui.init()
    this.health.draw(3)
    this.drawBlocks()
    this.drawSlots()
  }

  // Implementar bloques
  async drawBlocks () {
    const { figures, metrics } = this.level
    const melody = this.melody.current
    const groupedMelody = this.melody.divide(melody, metrics.figures)

    // Generar grupos de figuras faltantes
    while (groupedMelody.length !== metrics.blocks) {
      let randomizedFigures = []
      let existingGroup = false

      // Hasta crear un grupo sea único
      do {
        randomizedFigures = Phaser.Utils.Array
          .Shuffle(figures)
          .slice(0, metrics.figures)

        existingGroup = groupedMelody.some(
          group => JSON.stringify(group) === JSON.stringify(randomizedFigures)
        )
      } while (existingGroup)

      groupedMelody.push(randomizedFigures)
    }
    const shuffledFigures = Phaser.Utils.Array.Shuffle(groupedMelody)

    grid({
      totalItems: metrics.blocks,
      item: { width: 340, height: 200 },
      maxColumns: 3,
      gap: 40,
      position: [170, 250],
      element: ({ x, y }, i) => {
        const block = new Block(this)
        block.draw({ x, y, size: metrics.figures })
        block.setFigures(shuffledFigures[i])
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
