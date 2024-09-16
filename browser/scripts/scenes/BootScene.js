class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
    this.settings = window.gameSettings
  }

  preload () {
    const { id, type, background } = this.settings

    // Cargar los recursos gráficos
    this.load.setPath('/assets/games')
    this.load.image('openingLogos', '/resources/opening-logos.png')
    this.load.image('background', `/${type}/${background}`)
    this.load.image('gameLogo', `/logos/${id}.png`)
    this.load.image('slot', `/${type}/casilla-vacia.png`)

    // Cargar figuras musicales
    this.load.image('semibreve', `/${type}/btn-semibreve.png`)
    this.load.image('semibreve-rest', `/${type}/btn-semibreve-rest.png`)
    this.load.image('minim', `/${type}/btn-minim.png`)
    this.load.image('minim-rest', `/${type}/btn-minim-rest.png`)
    this.load.image('crotchet', `/${type}/btn-crotchet.png`)
    this.load.image('crotchet-rest', `/${type}/btn-crotchet-rest.png`)

    // Cargar las fuentes
    this.load.setPath('/assets/games/resources/fonts')
    this.load.bitmapFont('primaryFont', '/examplefont.png', '/examplefont.fnt')

    // Cargar la interfaz de usuario (UI)
    this.load.setPath(`/assets/games/${type}/ui`)
    this.load.atlas('uiMainMenu', '/main-menu.png', '/main-menu.json')
    this.load.atlas('uiLvlSelection', '/level-selection.png', '/level-selection.json')

    // Cargar los sonidos
    this.load.setPath('/assets/games/sounds')
    this.load.audio('noteSound', 'note-sound.mp3')
  }

  // Mostrar los logos con la animación de fade-in y fade-out
  create () {
    const { centerX, centerY } = this.cameras.main
    const logo = this.add.image(centerX, centerY, 'openingLogos')

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
