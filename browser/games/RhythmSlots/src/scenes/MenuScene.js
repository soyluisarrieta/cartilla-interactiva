import { addInteractions } from '../../../assets/utils/addInteractions.js'

export default class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MenuScene' })
  }

  create () {
    const { width: widthScreen, height: heightScreen } = this.cameras.main

    // Imagen de fondo y Logo
    this.add.image(0, 0, 'bgMenu')
      .setOrigin(0)
      .setDisplaySize(widthScreen, heightScreen)

    this.add.image(widthScreen / 2, 70, 'gameLogo')
      .setOrigin(0.5, 0)
      .setScale(1.1)

    // Texturas e interacciónes del botón de empezar
    const playButton = this.add.image(widthScreen / 2.6, heightScreen - 270, 'btnStart', 'start-btn')
      .setScale(0.9)
      .setInteractive()

    addInteractions({
      button: playButton,
      key: 'btnStart',
      frame: 'start-btn',
      onClick: () => {
        this.sound.play('soundPress')
        this.scene.start('LevelSelectionScene')
      }
    })

    // Texturas e interacciónes del botón de instrucciones
    const howToPlayButton = this.add.image(widthScreen / 1.64, heightScreen - 270, 'btnHowToPlay', 'how-to-play-btn')
      .setScale(0.9)
      .setInteractive()

    addInteractions({
      button: howToPlayButton,
      key: 'btnHowToPlay',
      frame: 'how-to-play-btn',
      onClick: () => {
        this.game.sound.play('soundPress')
        this.scene.start('HowToPlayScene')
      }
    })
  }
}
