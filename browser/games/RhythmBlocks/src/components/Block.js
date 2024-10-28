import { UI } from '../constants.js'

export class Block {
  constructor (scene) {
    this.phaser = scene
    this.block = null
  }

  draw ({ x, y, size }) {
    this.block = this.phaser.add
      .image(x, y, UI.BLOCKS.KEY, UI.BLOCKS.BLOCK(size))
      .setScale(0.6)
      .setOrigin(0)

    this.setup({ x, y })
    return this.block
  }

  setup ({ x, y }) {
    this.block.initialX = x
    this.block.initialY = y
    this.block.currentSlot = null

    this.draggable()
  }

  draggable () {
    const { block } = this
    block.setInteractive({ draggable: true })

    block.on('dragstart', () => {
      block.setTint(0xff0000)
      if (block.currentSlot) {
        block.currentSlot.release()
      }
    })

    block.on('drag', (pointer, dragX, dragY) => {
      block.x = dragX
      block.y = dragY
    })

    block.on('dragend', (pointer) => {
      block.clearTint()
      const droppedInSlot = this.phaser.slots.find((slot) =>
        Phaser.Geom.Rectangle.ContainsPoint(slot.getBounds(), pointer)
      )
      if (droppedInSlot) {
        this.handleBlockDrop(block, droppedInSlot)
      } else {
        block.currentSlot = null
        this.moveBlock(block, block.initialX, block.initialY)
      }
    })
  }

  moveBlock (block, x, y, onComplete = () => {}) {
    block.disableInteractive()
    this.phaser.tweens.add({
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

  swapBlocks (block, occupyingBlock, previousSlot, newSlot) {
    previousSlot.release()

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

  placeBlockInEmptySlot (block, slot) {
    this.moveBlock(
      block,
      slot.x + (slot.width * slot.scaleX / 2) - (block.width * block.scaleX / 2),
      slot.y - (slot.height * slot.scaleY / 2) - (block.height * block.scaleY / 2)
    )
    slot.occupied = true
    slot.currentBlock = block
    block.currentSlot = slot
  }
}
