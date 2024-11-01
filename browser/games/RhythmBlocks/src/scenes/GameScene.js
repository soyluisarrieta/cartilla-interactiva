import Block from '../components/Block.js'
import Melody from '../../../core/Melody.js'
import Slot from '../components/Slot.js'
import UIManager from '../components/UIManager.js'
import Alert from '../../../core/components/Alert.js'
import Health from '../../../core/components/Health.js'
import Exercises from '../../../core/components/Exercises.js'
import { SCENES } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'
import { UI } from '../constants.js'
import Socket from '../../../core/Socket.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })

    this.ui = new UIManager(this)
    this.alert = new Alert(this)
    this.melody = new Melody(this)
    this.health = new Health(this)
    this.exercises = new Exercises(this)
    this.socket = new Socket(this)

    Exercises.position = [50, 150]
  }

  // Inicialización
  init (level) {
    this.game = window.gameSettings
    this.level = level
    this.slots = []
    this.blocks = []
  }

  // Principal
  create () {
    this.ui.init()
    this.health.draw(3)
    this.exercises.create(7)
    this.start()
    this.exercises.play(0)

    // Iniciar cronometro
    this.levelStartTimer = Date.now()
  }

  // Iniciar ejercicio
  start () {
    this.blocks?.forEach(block => block.destroy())
    this.slots?.forEach(slot => slot.destroy())

    this.blocks = []
    this.slots = []

    const { figures, metrics } = this.level
    const numFigures = metrics.figures * metrics.slots
    const generatedMelody = this.melody.generate(figures, numFigures)

    this.drawBlocks()
    this.drawSlots()

    // Iniciar primer ejercicio
    if (!this.exercises.current) {
      this.exercises.play(0)
    }

    // Almacenar melodía y duración en el ejercicio actual
    const indexExercise = this.exercises.current.index
    const currentExercise = this.exercises.all[indexExercise]
    currentExercise.melody = generatedMelody
  }

  // Implementar bloques
  drawBlocks () {
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

    // Obtener las dimensiones del bloque
    const blockDimensions = this.textures
      .get(UI.BLOCKS.KEY)
      .get(UI.BLOCKS.BLOCK(metrics.figures))

    grid({
      totalItems: metrics.blocks,
      item: blockDimensions,
      scale: Block.scale,
      maxColumns: metrics.figures === 2 ? 3 : (metrics.figures === 3 ? 2 : 1),
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

    // Obtener las dimensiones del slot
    const slotDimensions = this.textures
      .get(UI.BLOCKS.KEY)
      .get(UI.BLOCKS.SLOT(metrics.figures))

    grid({
      totalItems: metrics.slots,
      item: slotDimensions,
      scale: Slot.scale,
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
