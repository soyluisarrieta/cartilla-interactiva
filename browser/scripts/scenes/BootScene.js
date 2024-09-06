class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
    this.settings = window.gameSettings
  }

  preload () {
    // Cargar recursos
    this.load.setPath('/assets/games')
    this.load.image('logos', '/resources/logos.png')
    this.load.image('background', `/${this.settings.key}/${this.settings.background}`)
    this.load.image('logo', `/${this.settings.key}/logo.png`)
    this.load.image('slot', `/${this.settings.key}/casilla-vacia.png`)

    this.load.image('crotchet', `/${this.settings.key}/btn-crotchet.png`)
    this.load.image('crotchet-rest', `/${this.settings.key}/btn-crotchet-rest.png`)

    // Cargar fuentes
    this.load.setPath('/assets/games/fonts')
    this.load.bitmapFont('primaryFont', '/examplefont.png', '/examplefont.fnt')

    // Cargar UI
    this.load.setPath('/assets/games/ui')
    this.load.atlas('uiMainMenu', '/main-menu.png', '/main-menu.json')
    this.load.atlas('uiLvlSelection', '/level-selection.png', '/level-selection.json')
  }

  create () {
    // Mostrar logos
    const logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'logos')

    // Realizar el fade-in y escala, luego el fade-out y escala
    this.tweens.add({
      targets: logo,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.9, to: 1 },
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          this.tweens.add({
            targets: logo,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
              this.scene.start('MenuScene')
            }
          })
        })
      }
    })
  }
}

export default BootScene
