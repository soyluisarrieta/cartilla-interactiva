import { UI } from '../constants.js'

export class Slot extends Phaser.GameObjects.Image {
  constructor (scene) {
    super(scene)
    this.scene = scene
    this.scene.add.existing(this)
  }

  draw ({ x, y, size }) {
    this.setTexture(UI.BLOCKS.KEY, UI.BLOCKS.SLOT(size))
    this.setPosition(x, y).setScale(0.7).setOrigin(0, 1)
    this.release()
    return this
  }

  release () {
    this.occupied = false
    this.currentBlock = null
  }
}
