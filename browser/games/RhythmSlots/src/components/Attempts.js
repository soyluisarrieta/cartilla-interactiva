export default class Attempts {
  constructor (scene) {
    this.scene = scene
    this.total = null
    this.elements = []
  }

  // Mostrar los intentos o vidas
  draw (attempts) {
    const layout = { marginTop: 70, gap: 80 }
    const position = { x: this.scene.screen.width - 90, y: layout.marginTop }

    this.total = attempts

    for (let i = 0; i < attempts; i++) {
      const attempt = this.scene.add.image(position.x - (i * layout.gap), position.y, 'uiLvlSelection', 'btn-arrow-hovered')
        .setScale(0.7)
        .setOrigin(0.5)

      this.elements.push(attempt)
    }
  }

  update (number) {
    const newTotal = number + this.total
    this.total = newTotal > 0 ? newTotal : 0

    if (newTotal < 0) { return 0 }
    const attemptsIndex = this.elements.length - newTotal - 1
    this.elements[attemptsIndex].setTexture('uiLvlSelection', 'btn-arrow-pressed')
    return newTotal
  }
}
