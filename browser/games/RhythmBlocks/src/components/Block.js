import { UI } from '../constants.js'

export class Block extends Phaser.GameObjects.Image {
  constructor (scene) {
    super(scene)
    this.scene = scene
    this.scene.add.existing(this)
  }

  draw ({ x, y, size }) {
    this.setTexture(UI.BLOCKS.KEY, UI.BLOCKS.BLOCK(size))
    this.setPosition(x, y).setScale(0.6).setOrigin(0)
    this.setup({ x, y })
    return this
  }

  setup ({ x, y }) {
    this.initialX = x
    this.initialY = y
    this.currentSlot = null

    this.draggable()
  }

  draggable () {
    this.setInteractive({ draggable: true })

    this.on('dragstart', () => {
      this.setTint(0xff0000)
      if (this.currentSlot) {
        this.currentSlot.release()
      }
    })

    this.on('drag', (pointer, dragX, dragY) => {
      this.x = dragX
      this.y = dragY
    })

    this.on('dragend', (pointer) => {
      this.clearTint()
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
      newSlot.x + (newSlot.width * newSlot.scaleX / 2) - (block.width * block.scaleX / 2),
      newSlot.y - (newSlot.height * newSlot.scaleY / 2) - (block.height * block.scaleY / 2)
    )

    this.move(
      occupyingBlock,
      previousSlot.x + (previousSlot.width * previousSlot.scaleX / 2) - (occupyingBlock.width * occupyingBlock.scaleX / 2),
      previousSlot.y - (previousSlot.height * previousSlot.scaleY / 2) - (occupyingBlock.height * occupyingBlock.scaleY / 2)
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
      slot.x + (slot.width * slot.scaleX / 2) - (block.width * block.scaleX / 2),
      slot.y - (slot.height * slot.scaleY / 2) - (block.height * block.scaleY / 2)
    )
  }

  placeInEmptySlot (block, slot) {
    this.move(
      block,
      slot.x + (slot.width * slot.scaleX / 2) - (block.width * block.scaleX / 2),
      slot.y - (slot.height * slot.scaleY / 2) - (block.height * block.scaleY / 2)
    )
    slot.occupied = true
    slot.currentBlock = block
    block.currentSlot = slot
  }
}
