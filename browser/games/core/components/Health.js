import UIAnimations from '../UIAnimations.js'
import { HEALTH } from '../constants.js'

export default class Health {
  static gap = 95

  constructor (scene) {
    this.scene = scene
    this.total = 0
    this.elements = []
    this.uiAnimations = new UIAnimations(scene)
  }

  // Implementación
  draw (health) {
    const { width } = this.scene.cameras.main
    this.total = health

    for (let i = 0; i < health; i++) {
      const health = this.scene.add.image(width - 90 - (i * Health.gap), 100, HEALTH.ON)
        .setScale(0.5)
        .setOrigin(0.5)

      this.elements.push(health)
      this.uiAnimations.scaleUp({
        targets: health,
        duration: 500,
        delay: i * 200,
        endScale: 0.5
      })
    }
  }

  // Perder salud
  miss () {
    if (this.total <= 0) { return 0 }
    const healthIndex = this.elements.length - (this.total - 1) - 1
    this.elements[healthIndex].setTexture(HEALTH.OFF)
    return --this.total
  }
}
