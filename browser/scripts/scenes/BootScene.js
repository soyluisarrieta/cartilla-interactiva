import { mergeObjects } from '/scripts/Utils.js'

class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })

    // Configuración predeterminada
    const defaultSettings = {
      background: 'background',
      title: {
        frame: 'bg-title',
        image: 'uiLvlSelection',
        imagePositionY: 50,
        text: 'Selecciona un nivel',
        fontFamily: 'primaryFont',
        textPositionY: 65
      },
      levels: {
        name: ['Nivel 1'],
        image: 'uiLvlSelection',
        images: [],
        frame: 'btn-arrow',
        width: 200,
        gap: 100,
        textScale: 0.5,
        fontFamily: 'primaryFont',
        buttonScale: 2,
        positionY: 400
      },
      homeButtonY: 230
    }

    this.settings = mergeObjects(defaultSettings, window.gameSettings)
  }

  preload () {
    // Cargar recursos
    this.load.setPath('/assets/games')
    this.load.image('logos', '/resources/logos.png')
    this.load.image('background', `/${this.settings.key}/${this.settings.background}`)

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
