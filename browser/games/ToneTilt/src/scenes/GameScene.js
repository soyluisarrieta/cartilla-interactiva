import Health from '../../../core/components/Health.js'
import Alert from '../../../core/components/Alert.js'
import UIManager from '../components/UIManager.js'
import UIAnimations from '../../../core/UIAnimations.js'
import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import { TONE_DIRECTIONS } from '../constants.js'
import { getProfile, setProfile } from '../../../../scripts/Profile.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })

    this.ui = new UIManager(this)
    this.health = new Health(this)
    this.alert = new Alert(this)
    this.uiAnimations = new UIAnimations(this)
  }

  // Inicialización
  init () {
    this.game = window.gameSettings
    this.tone = this.sound.add('noteSound')
    this.profile = getProfile()
    this.bestScore = this.profile.games[this.game.id].bestScore ?? 0
    this.score = 0
  }

  // Principal
  create () {
    this.ui.init()
    this.health.draw(3)
    this.start()
    this.drawScore()
    this.playToneButton()
    this.toneChangeButtons()

    // Sonido de inicio de partida
    this.sound.stopAll()
    this.sound.play('startGame')
  }

  // Iniciar ejercicio
  start () {
    const minRate = 0.95
    const maxRate = 1.05
    const minDifference = 0.1
    const maxDifference = 1.0

    this.originalToneRate = this.alteredToneRate ?? Phaser.Math
      .FloatBetween(minRate, maxRate)
      .toFixed(2)

    let adjustedRange
    const originalRate = parseFloat(this.originalToneRate)

    // Calcular el rango ajustado basado en la diferencia mínima y máxima
    const isIncreased = Phaser.Math.Between(0, 1) === 0

    // Asegurar que el nuevo rango esté dentro de los límites y sea diferente
    if (isIncreased) {
      const lowerBound = Math.max(originalRate + minDifference, maxRate)
      const upperBound = Math.min(originalRate + maxDifference, maxRate)
      do {
        adjustedRange = Phaser.Math.FloatBetween(lowerBound, upperBound).toFixed(2)
      } while (adjustedRange === this.originalToneRate)
    } else {
      const lowerBound = Math.max(minRate, originalRate - maxDifference)
      const upperBound = Math.min(originalRate - minDifference, minRate)
      do {
        adjustedRange = Phaser.Math.FloatBetween(lowerBound, upperBound).toFixed(2)
      } while (adjustedRange === this.originalToneRate)
    }

    // Ajustar el valor alterado del tono
    this.alteredToneRate = adjustedRange
  }

  // Marcador de puntos
  drawScore () {
    const { width } = this.cameras.main

    this.scoreText = this.add
      .bitmapText(width - 200, 350, FONTS.PRIMARY, this.score, 70)
      .setOrigin(0.5, 0)

    this.add
      .bitmapText(width - 200, 450, FONTS.PRIMARY, 'Puntos', 32)
      .setOrigin(0.5, 0)

    this.bestScoreText = this.add
      .bitmapText(width - 200, 650, FONTS.PRIMARY, this.bestScore, 70)
      .setOrigin(0.5, 0)

    this.add
      .bitmapText(width - 200, 750, FONTS.PRIMARY, 'Mejor puntaje', 32)
      .setOrigin(0.5, 0)
  }

  // Ganar punto
  point () {
    this.score = this.score + 100
    this.scoreText.setText(this.score)

    // Actualizar mejor puntaje
    if (this.score > this.bestScore) {
      this.bestScore = this.score
      this.bestScoreText.setText(this.bestScore)
      this.profile.games[this.game.id].bestScore = this.score
      setProfile(this.profile)
    }
  }

  // Botón: Reproducir tonos
  playToneButton () {
    const { height } = this.cameras.main
    const [x, y] = [400, height / 2 + 50]

    const label = this.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Reproducir', 32)
      .setOrigin(0.5)

    const button = Button.draw(this)({
      ...BUTTONS.LISTEN_MELODY,
      position: [x, y],
      withInteractions: false,
      onClick: ({ button }) => {
        label.setAlpha(0.5)
        button.setDisabled(true)
        button.setScale(0.9)

        // Reproducir el sonido con el tono original
        this.tone.setRate(this.originalToneRate)
        this.tone.play()

        // Reproducir el sonido con tono aumentado después de un retraso
        this.time.delayedCall(this.tone.duration * 700, () => {
          this.tone.setRate(this.alteredToneRate)
          this.tone.play()
          this.time.delayedCall(this.tone.duration * 500, () => {
            label.setAlpha(1)
            button.setDisabled(false)
            button.setScale(1)
          })
        })
      }
    })
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
      const alert = {
        title: '¡Opción incorrecta!',
        type: 'error',
        image: 'gameLogo',
        message: 'Has perdido una de tus vidas, vuelve a intentarlo.',
        sound: 'incorrectMelody'
      }

      const totalHealth = this.health.total
      const isGameOver = totalHealth === 0
      if (isGameOver) {
        alert.title = '¡Fin del juego'
        alert.type = 'default'
        alert.image = 'gameLogo'
        alert.message = 'Has perdido todas tus vidas, ¡pero puedes volver a jugar!'
        alert.sound = 'gameOver'
      }

      const buttons = [
        {
          text: 'Volver a jugar',
          onClick: () => {
            this.scene.restart()
          }
        },
        {
          text: 'Salir',
          onClick: () => {
            this.scene.start(SCENES.MENU)
          }
        }
      ]

      this.alert.showAlert(alert.title, {
        type: alert.type,
        image: alert.image,
        message: alert.message,
        btnAccept: !isGameOver,
        buttons: isGameOver ? buttons : [],
        dismissible: false
      })

      this.sound.stopAll()
      this.sound.play(alert.sound)
      return null
    }

    // Correcto
    this.alert.showAlert('¡Perfecto!', {
      type: 'success',
      image: 'gameLogo',
      message: `Has identificado correctamente que el tono ${INCREASED ? 'aumenta' : 'disminuye'}.`,
      btnAccept: true
    })

    this.point()
    this.sound.stopAll()
    this.sound.play('perfectMelody')
    this.start()
  }
}
