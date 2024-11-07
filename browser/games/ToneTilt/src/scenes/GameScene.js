import Alert from '../../../core/components/Alert.js'
import Melody from '../../../core/Melody.js'
import UIManager from '../components/UIManager.js'
import UIAnimations from '../../../core/UIAnimations.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import Button from '../../../core/components/Button.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })

    this.ui = new UIManager(this)
    this.alert = new Alert(this)
    this.melody = new Melody(this)
    this.uiAnimations = new UIAnimations(this)
  }

  // Inicialización
  init (level) {
    this.game = window.gameSettings
    this.level = level
    this.tone = this.sound.add('noteSound')
  }

  // Principal
  create () {
    this.ui.init()
    this.playButton()
    this.start()

    // Sonido de inicio de partida
    this.sound.stopAll()
    this.sound.play('startGame')
  }

  // Iniciar ejercicio
  start () {

  }

  // Botón: Reproducir tonos
  playButton () {
    const { height } = this.cameras.main
    const [x, y] = [250, height / 2]

    const alteration = [1.0, 1.02]

    const button = Button.draw(this)({
      ...BUTTONS.LISTEN_MELODY,
      position: [x, y],
      withInteractions: true,
      onClick: ({ button }) => {
        console.log(this.tone.setRate, alteration)

        // Reproducir el sonido con el tono normal
        this.tone.setRate(alteration[0])
        this.tone.play()

        // Reproducir el sonido con tono aumentado después de un retraso
        this.time.delayedCall(this.tone.duration * 1000, () => {
          this.tone.setRate(alteration[1])
          this.tone.play()
        })
      }
    })

    const label = this.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Reproducir', 32)
      .setOrigin(0.5)
  }
}
