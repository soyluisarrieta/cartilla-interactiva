export default class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
    this.settings = window.gameSettings
  }

  preload () {
    const { id } = this.settings

    // Cargar assets
    this.load.setPath('/assets/games')
    this.load.image('openingLogos', '/resources/opening-logos.png')
    this.load.image('gameLogo', `/logos/${id}.png`)

    this.load.atlas('btnPlay', '/resources/ui/btn-play.png', '/resources/ui/btn-play.json')

    // Cargar los recursos gráficos
    this.load.setPath('/games/RhythmSlots/assets/images')
    this.load.image('background', '/bg-menu.jpg')
    this.load.image('slot', '/slot.png')

    // Cargar figuras musicales
    this.load.image('semibreve', '/btn-semibreve.png')
    this.load.image('semibreve-rest', '/btn-semibreve-rest.png')
    this.load.image('minim', '/btn-minim.png')
    this.load.image('minim-rest', '/btn-minim-rest.png')
    this.load.image('crotchet', '/btn-crotchet.png')
    this.load.image('crotchet-rest', '/btn-crotchet-rest.png')

    // Cargar interfaz de usuario (UI)
    this.load.setPath('/games/RhythmSlots/assets/ui')
    this.load.atlas('uiMainMenu', '/main-menu.png', '/main-menu.json')
    this.load.atlas('uiLvlSelection', '/level-selection.png', '/level-selection.json')

    // Cargar sonidos
    this.load.setPath('/games/RhythmSlots/assets/sounds')
    this.load.audio('noteSound', 'note-sound.mp3')

    // Cargar fuentes
    this.load.setPath('/assets/games/resources/fonts')
    this.load.bitmapFont('primaryFont', '/examplefont.png', '/examplefont.fnt')
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
