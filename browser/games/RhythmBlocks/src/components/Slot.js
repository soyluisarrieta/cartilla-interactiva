import { UI } from '../constants.js'

export class Slot {
  constructor (scene) {
    this.phaser = scene
  }

  draw ({ x, y, size }) {
    this.slot = this.phaser.add
      .image(x, y, UI.BLOCKS.KEY, UI.BLOCKS.SLOT(size))
      .setScale(0.7)
      .setOrigin(0, 1)

    return this.slot
  }

  setup () {
    this.slot.occupied = false
    this.slot.currentBlock = null
  }
}
