class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
  }

  create () {
    // Crear el contenido del juego aquí
    this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' })
  }
}

export default GameScene
