import Health from '../../../core/components/Health.js'
import Exercises from '../../../core/components/Exercises.js'
import Alert from '../../../core/components/Alert.js'
import UIManager from '../components/UIManager.js'
import UIAnimations from '../../../core/UIAnimations.js'
import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import { TONE_DIRECTIONS } from '../constants.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })

    this.ui = new UIManager(this)
    this.health = new Health(this)
    this.exercises = new Exercises(this)
    this.alert = new Alert(this)
    this.uiAnimations = new UIAnimations(this)
    this.originalToneRate = 1.4
    this.alteredToneRate = 1.3
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
    this.health.draw(3)
    this.exercises.create(7)
    this.playToneButton()
    this.toneChangeButtons()
    this.start()
    this.exercises.play(0)

    // Sonido de inicio de partida
    this.sound.stopAll()
    this.sound.play('startGame')
  }

  // Iniciar ejercicio
  start () {

  }

  // Botón: Reproducir tonos
  playToneButton () {
    const { height } = this.cameras.main
    const alteration = [this.originalToneRate, this.alteredToneRate]
    const [x, y] = [400, height / 2 + 50]

    const button = Button.draw(this)({
      ...BUTTONS.LISTEN_MELODY,
      position: [x, y],
      withInteractions: true,
      onClick: ({ button }) => {
        // Reproducir el sonido con el tono original
        this.tone.setRate(alteration[0])
        this.tone.play()

        // Reproducir el sonido con tono aumentado después de un retraso
        this.time.delayedCall(this.tone.duration * 700, () => {
          this.tone.setRate(alteration[1])
          this.tone.play()
        })
      }
    })

    const label = this.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Reproducir', 32)
      .setOrigin(0.5)
  }

  // Botón: Comparar tono incrementado/disminuido
  toneChangeButtons () {
    const { INCREASED, DECREASED } = TONE_DIRECTIONS
    const { height } = this.cameras.main
    const [x, y] = [900, height / 2 + 50]
    const gap = 200

    // Tono aumentó
    const buttonIncreased = Button.draw(this)({
      ...BUTTONS.ARROW_RIGHT,
      position: [x, y - gap],
      withInteractions: true,
      onClick: ({ button }) => this.verifyToneChange(INCREASED)
    })

    const labelIncreased = this.add
      .bitmapText(x, y - gap + 110, FONTS.PRIMARY, 'Aumentó', 32)
      .setOrigin(0.5)

    // Tono disminuyó
    const buttonDecreased = Button.draw(this)({
      ...BUTTONS.ARROW_LEFT,
      position: [x, y + gap],
      withInteractions: true,
      onClick: ({ button }) => this.verifyToneChange(DECREASED)
    })

    const labelDecreased = this.add
      .bitmapText(x, y + gap + 110, FONTS.PRIMARY, 'Disminuyó', 32)
      .setOrigin(0.5)
  }

  // Comprobar elección
  verifyToneChange (userChoice) {
    const { INCREASED, DECREASED } = TONE_DIRECTIONS
    const toneDirection = this.originalToneRate < this.alteredToneRate
      ? INCREASED
      : DECREASED

    // Incorrecto
    if (userChoice !== toneDirection) {
      this.health.miss()
      console.log('¡Incorrecto! Inténtalo de nuevo.')
      return null
    }

    // Correcto
    this.exercises.complete()
    if (toneDirection === INCREASED) {
      console.log('¡Correcto! El tono aumentó.')
    } else {
      console.log('¡Correcto! El tono disminuyó.')
    }
  }
}
