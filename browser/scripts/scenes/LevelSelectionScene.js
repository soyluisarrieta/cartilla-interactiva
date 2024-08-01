class LevelSelectionScene extends Phaser.Scene {
  constructor () {
    super({ key: 'LevelSelectionScene' })
  }

  preload () {
    // Cargar los recursos necesarios para la selección de niveles
  }

  create () {
    // Mostrar los niveles
    this.add.bitmapText(10, 10, 'primaryFont', 'Lorem ipsum\ndolor sit amet')
  }
}

export default LevelSelectionScene
