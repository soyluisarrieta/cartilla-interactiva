class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
    this.settings = window.gameSettings
  }

  preload () {
    const { key, background } = this.settings

    // Cargar los recursos gráficos
    this.load.setPath('/assets/games')
    this.load.image('logos', '/resources/logos.png')
    this.load.image('background', `/${key}/${background}`)
    this.load.image('logo', `/${key}/logo.png`)
    this.load.image('slot', `/${key}/casilla-vacia.png`)
    this.load.image('crotchet', `/${key}/btn-crotchet.png`)
    this.load.image('crotchet-rest', `/${key}/btn-crotchet-rest.png`)

    // Cargar las fuentes
    this.load.setPath('/assets/games/fonts')
    this.load.bitmapFont('primaryFont', '/examplefont.png', '/examplefont.fnt')

    // Cargar la interfaz de usuario (UI)
    this.load.setPath('/assets/games/ui')
    this.load.atlas('uiMainMenu', '/main-menu.png', '/main-menu.json')
    this.load.atlas('uiLvlSelection', '/level-selection.png', '/level-selection.json')
  }

  // Mostrar los logos con la animación de fade-in y fade-out
  create () {
    const { centerX, centerY } = this.cameras.main
    const logo = this.add.image(centerX, centerY, 'logos')

    this.tweens.add({
      targets: logo,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.9, to: 1 },
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          this.fadeOutLogo(logo)
        })
      }
    })
  }

  // Animación de fade-out de los logo
  fadeOutLogo (logo) {
    this.tweens.add({
      targets: logo,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.scene.start('MenuScene')
      }
    })
  }
}

export default BootScene
