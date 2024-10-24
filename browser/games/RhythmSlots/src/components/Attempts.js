export default class Attempts {
  constructor (gameScene) {
    this.game = gameScene
    this.total = 3
    this.element = null
  }

  // Inicializar la barra de vida
  draw () {
    const { width } = this.game.screen
    this.element = this.game.add.image(width - 50, 50, 'healthBar', `health-bar-${this.total}`)
      .setScale(0.7)
      .setOrigin(1, 0)
  }

  // Actualizar la barra de vida
  update (number) {
    const newTotal = number + this.total
    this.total = newTotal > 0 ? newTotal : 0
    this.element.setTexture('healthBar', `health-bar-${newTotal}`)
    return newTotal
  }
}
