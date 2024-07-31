class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MenuScene' })
  }

  preload () {
    this.load.image('background', '/assets/games/game-1/bg-menu.jpg')

    this.load.setPath('/assets/games/')
    this.load.atlas('assets', 'main-menu/ui.png', 'main-menu/ui.json')
  }

  create () {
    const { width, height } = this.cameras.main

    // Mostrar imagen de fondo
    this.add.image(width / 2, height / 2, 'background')
      .setDisplaySize(width, height)

    this.add.image(width / 2, 40, 'assets', 'logo')
      .setOrigin(0.5, 0)
      .setScale(1.6)

    // Texturas del botón
    const playButton = this.add.image(width / 2, height - 230, 'assets', 'button')
      .setInteractive()

    playButton.on('pointerout', () => {
      playButton.setTexture('assets', 'button')
    })

    playButton.on('pointerover', () => {
      playButton.setTexture('assets', 'button_hovered')
    })

    playButton.on('pointerdown', () => {
      playButton.setTexture('assets', 'button_pressed')
    })

    playButton.on('pointerup', () => {
      playButton.setTexture('assets', 'button')
      this.scene.start('LevelSelectionScene')
    })
  }
}

export default MenuScene
