export default class Attempts {
  constructor (gameScene) {
    this.game = gameScene
    this.total = null
    this.elements = []
  }

  // Mostrar los intentos o vidas
  draw (attempts) {
    const layout = { marginTop: 100, gap: 95 }
    const position = { x: this.game.screen.width - 90, y: layout.marginTop }

    this.total = attempts

    for (let i = 0; i < attempts; i++) {
      const attempt = this.game.add.image(position.x - (i * layout.gap), position.y, 'health-on')
        .setScale(0.5)
        .setOrigin(0.5)

      this.elements.push(attempt)
    }
  }

  // Actualizar vida
  update (number) {
    const newTotal = number + this.total
    this.total = newTotal > 0 ? newTotal : 0

    if (newTotal < 0) { return 0 }
    const attemptsIndex = this.elements.length - newTotal - 1
    this.elements[attemptsIndex].setTexture('health-off')
    return newTotal
  }
}
