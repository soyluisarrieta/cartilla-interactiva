class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    // Cargar recursos necesarios
  }

  create () {
    // Cambiar a la escena de juego
    this.scene.start('GameScene')
  }
}

export default BootScene
