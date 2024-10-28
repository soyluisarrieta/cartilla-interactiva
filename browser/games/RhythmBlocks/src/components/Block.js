import { UI } from '../constants.js'

export class Block extends Phaser.GameObjects.Container {
  constructor (scene) {
    super(scene)
    this.scene = scene
    this.scene.add.existing(this)
  }

  draw ({ x, y, size }) {
    this.blockImage = this.scene.add.image(0, 0, UI.BLOCKS.KEY, UI.BLOCKS.BLOCK(size))
      .setScale(0.6)
      .setOrigin(0)
    this.add(this.blockImage)

    // Definimos la hitbox del tamaño de la textura del bloque
    const hitbox = new Phaser.Geom.Rectangle(
      0, 0,
      this.blockImage.displayWidth,
      this.blockImage.displayHeight
    )
    this.setInteractive(hitbox, Phaser.Geom.Rectangle.Contains)

    this.setup({ x, y, size })
    this.setPosition(x, y)
    return this
  }

  setup ({ x, y }) {
    this.initialX = x
    this.initialY = y
    this.currentSlot = null
    this.draggable()
  }

  setFigures (figures, max) {
    this.figures = []
    const shuffledFigures = Phaser.Utils.Array.Shuffle(figures)
    const selectedFigures = shuffledFigures.slice(0, max)

    selectedFigures.forEach(({ name, duration, beats }) => {
      const figure = this.scene.add.image(0, 0, 'figures', name)
        .setData({ name, duration, beats })
        .setScale(0.15)
        .setOrigin(0.5)
      this.figures.push(figure)
      this.add(figure)
    })

    this.updateFiguresPosition()
  }

  // Distribuir las figuras
  updateFiguresPosition () {
    // Calcula el ancho y alto total del bloque
    const totalWidth = this.blockImage.displayWidth
    const totalHeight = this.blockImage.displayHeight
    const figureCount = this.figures.length

    if (figureCount === 0) {
      return
    }

    // Ajusta la fórmula para calcular el gap
    const figureWidth = this.figures[0].displayWidth
    const gap = (totalWidth - (figureCount * figureWidth)) / (figureCount + 1)

    // Inicializar currentX para centrar
    let currentX = gap + figureWidth / 2

    // Ajusta la posición de cada figura
    for (const figure of this.figures) {
      const centerY = totalHeight / 2 // Centro vertical del bloque
      figure.setPosition(currentX, centerY)
      currentX += figureWidth + gap
    }
  }

  draggable () {
    this.scene.input.setDraggable(this)

    this.on('dragstart', () => {
      this.blockImage.setTint(0xff0000)
      if (this.currentSlot) {
        this.currentSlot.release()
      }
    })

    this.on('drag', (pointer, dragX, dragY) => {
      this.setPosition(dragX, dragY)
    })

    this.on('dragend', (pointer) => {
      this.blockImage.clearTint()
      const droppedInSlot = this.scene.slots.find((slot) =>
        Phaser.Geom.Rectangle.ContainsPoint(slot.getBounds(), pointer)
      )
      if (droppedInSlot) {
        this.handleDrop(this, droppedInSlot)
      } else {
        this.currentSlot = null
        this.move(this, this.initialX, this.initialY)
      }
    })
  }

  move (block, x, y, onComplete = () => {}) {
    block.disableInteractive()
    this.scene.tweens.add({
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

  handleDrop (block, slot) {
    if (slot.occupied) {
      const occupyingBlock = slot.currentBlock
      if (block.currentSlot) {
        this.swap(block, occupyingBlock, block.currentSlot, slot)
      } else {
        this.replace(block, occupyingBlock, slot)
      }
    } else {
      this.placeInEmptySlot(block, slot)
    }
  }

  swap (block, occupyingBlock, previousSlot, newSlot) {
    previousSlot.release()

    block.currentSlot = newSlot
    occupyingBlock.currentSlot = previousSlot

    newSlot.currentBlock = block
    newSlot.occupied = true

    previousSlot.currentBlock = occupyingBlock
    previousSlot.occupied = true

    this.move(
      block,
      newSlot.x + (newSlot.width * newSlot.scaleX / 2) - (block.blockImage.width * block.blockImage.scaleX / 2),
      newSlot.y - (newSlot.height * newSlot.scaleY / 2) - (block.blockImage.height * block.blockImage.scaleY / 2)
    )

    this.move(
      occupyingBlock,
      previousSlot.x + (previousSlot.width * previousSlot.scaleX / 2) - (occupyingBlock.blockImage.width * occupyingBlock.blockImage.scaleX / 2),
      previousSlot.y - (previousSlot.height * previousSlot.scaleY / 2) - (occupyingBlock.blockImage.height * occupyingBlock.blockImage.scaleY / 2)
    )
  }

  replace (block, occupyingBlock, slot) {
    this.move(occupyingBlock, occupyingBlock.initialX, occupyingBlock.initialY, () => {
      occupyingBlock.currentSlot = null
      if (occupyingBlock.initialSlot) {
        occupyingBlock.initialSlot.occupied = false
      }
    })

    block.currentSlot = slot
    slot.currentBlock = block
    slot.occupied = true

    this.move(
      block,
      slot.x + (slot.width * slot.scaleX / 2) - (block.blockImage.width * block.blockImage.scaleX / 2),
      slot.y - (slot.height * slot.scaleY / 2) - (block.blockImage.height * block.blockImage.scaleY / 2)
    )
  }

  placeInEmptySlot (block, slot) {
    this.move(
      block,
      slot.x + (slot.width * slot.scaleX / 2) - (block.blockImage.width * block.blockImage.scaleX / 2),
      slot.y - (slot.height * slot.scaleY / 2) - (block.blockImage.height * block.blockImage.scaleY / 2)
    )
    slot.occupied = true
    slot.currentBlock = block
    block.currentSlot = slot
  }
}
