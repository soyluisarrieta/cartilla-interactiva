import { getProfile } from '../../../../scripts/Profile.js'
import Button from '../../../core/components/Button.js'
import { SCENES, BUTTONS, FONTS } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'
import { UI } from '../constants.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })
    this.slots = []
    this.blocks = []
  }

  // Inicializa el nivel y perfil del jugador
  init () {
    const selectedLevel = 0
    const profile = getProfile()
    this.game = profile.playing
    this.level = profile.playing.levels[selectedLevel]
  }

  // Crea los elementos principales de la escena
  create () {
    const { width } = this.cameras.main

    // Botón: Ir atrás
    Button.draw(this)({
      ...BUTTONS.BACK,
      scene: SCENES.MENU,
      position: [150, 120]
    })

    // Título
    this.add
      .bitmapText(width / 2, 100, FONTS.PRIMARY, 'GAME SCENE')
      .setOrigin(0.5, 0)

    // UI
    this.drawBlocks()
    this.drawSlots()
  }

  // Crear bloques
  drawBlocks () {
    const totalBlocks = this.level.metrics.blocks
    grid({
      totalItems: totalBlocks,
      item: { width: 340, height: 200 },
      maxColumns: 3,
      gap: 40,
      position: [170, 250],
      element: this.setupBlock.bind(this)
    })
  }

  // Configurar bloque
  setupBlock ({ x, y }) {
    const block = this.add
      .image(x, y, UI.BLOCKS.KEY, UI.BLOCKS.BLOCK(2))
      .setScale(0.6)
      .setOrigin(0)
      .setInteractive({ draggable: true })

    block.initialX = x
    block.initialY = y
    block.currentSlot = null

    this.draggable(block)
    this.blocks.push(block)
  }

  // Eventos arrastrar y soltar
  draggable (block) {
    block.on('dragstart', () => {
      block.setTint(0xff0000)
      if (block.currentSlot) {
        this.releaseSlot(block.currentSlot)
      }
    })

    block.on('drag', (pointer, dragX, dragY) => {
      block.x = dragX
      block.y = dragY
    })

    block.on('dragend', (pointer) => {
      block.clearTint()
      const droppedInSlot = this.slots.find(slot => {
        return Phaser.Geom.Rectangle.ContainsPoint(slot.getBounds(), pointer)
      })

      if (droppedInSlot) {
        this.handleBlockDrop(block, droppedInSlot)
      } else {
        block.currentSlot = null
        this.moveBlock(block, block.initialX, block.initialY)
      }
    })
  }

  // Libera un slot, dejandolo vacío
  releaseSlot (slot) {
    if (slot.occupied !== undefined && slot.currentBlock !== undefined) {
      slot.occupied = false
      slot.currentBlock = null
    }
  }

  // Animación de desplazamiento
  moveBlock (block, x, y, onComplete = () => {}) {
    block.disableInteractive()
    this.tweens.add({
      targets: block,
      x,
      y,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        block.setInteractive()
        onComplete()
      }
    })
  }

  // Maneja la lógica cuando se suelta un bloque en un slot
  handleBlockDrop (block, slot) {
    if (slot.occupied) {
      const occupyingBlock = slot.currentBlock
      if (block.currentSlot) {
        this.swapBlocks(block, occupyingBlock, block.currentSlot, slot)
      } else {
        this.replaceBlock(block, occupyingBlock, slot)
      }
    } else {
      this.placeBlockInEmptySlot(block, slot)
    }
  }

  // Intercambia dos bloques entre sus respectivos slots
  swapBlocks (block, occupyingBlock, previousSlot, newSlot) {
    this.releaseSlot(previousSlot)

    block.currentSlot = newSlot
    occupyingBlock.currentSlot = previousSlot

    newSlot.currentBlock = block
    newSlot.occupied = true

    previousSlot.currentBlock = occupyingBlock
    previousSlot.occupied = true

    this.moveBlock(
      block,
      newSlot.x + (newSlot.width * newSlot.scaleX / 2) - (block.width * block.scaleX / 2),
      newSlot.y - (newSlot.height * newSlot.scaleY / 2) - (block.height * block.scaleY / 2)
    )

    this.moveBlock(
      occupyingBlock,
      previousSlot.x + (previousSlot.width * previousSlot.scaleX / 2) - (occupyingBlock.width * occupyingBlock.scaleX / 2),
      previousSlot.y - (previousSlot.height * previousSlot.scaleY / 2) - (occupyingBlock.height * occupyingBlock.scaleY / 2)
    )
  }

  // Reemplaza un bloque con otro, devolviendo el bloque existente a su posición inicial
  replaceBlock (block, occupyingBlock, slot) {
    this.moveBlock(occupyingBlock, occupyingBlock.initialX, occupyingBlock.initialY, () => {
      occupyingBlock.currentSlot = null
      if (occupyingBlock.initialSlot) {
        occupyingBlock.initialSlot.occupied = false
      }
    })

    block.currentSlot = slot
    slot.currentBlock = block
    slot.occupied = true

    this.moveBlock(
      block,
      slot.x + (slot.width * slot.scaleX / 2) - (block.width * block.scaleX / 2),
      slot.y - (slot.height * slot.scaleY / 2) - (block.height * block.scaleY / 2)
    )
  }

  // Coloca un bloque en un slot vacío
  placeBlockInEmptySlot (block, slot) {
    this.moveBlock(
      block,
      slot.x + (slot.width * slot.scaleX / 2) - (block.width * block.scaleX / 2),
      slot.y - (slot.height * slot.scaleX / 2) - (block.height * block.scaleY / 2)
    )
    slot.occupied = true
    slot.currentBlock = block
    block.currentSlot = slot
  }

  // Crear Slots
  drawSlots () {
    const { height } = this.cameras.main
    const totalSlots = this.level.metrics.slots

    grid({
      totalItems: totalSlots,
      item: { width: 400, height: 200 },
      maxColumns: 4,
      gap: 40,
      position: [90, height - 50],
      element: this.setupSlot.bind(this)
    })
  }

  // Configurar slot
  setupSlot ({ x, y }) {
    const slot = this.add
      .image(x, y, UI.BLOCKS.KEY, UI.BLOCKS.SLOT(2))
      .setScale(0.7)
      .setOrigin(0, 1)

    slot.occupied = false
    slot.currentBlock = null

    this.slots.push(slot)
  }
}
