import Health from '../../../core/components/Health.js'
import Alert from '../../../core/components/Alert.js'
import UIManager from '../components/UIManager.js'
import UIAnimations from '../../../core/UIAnimations.js'
import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import { TONE_DIRECTIONS } from '../constants.js'
import { getProfile, setProfile } from '../../../../scripts/profile.js'
import Socket from '../../../core/Socket.js'
import { calculateElapsedTime } from '../../../core/utils/calculateElapsedTime.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })

    this.ui = new UIManager(this)
    this.health = new Health(this)
    this.alert = new Alert(this)
    this.uiAnimations = new UIAnimations(this)
    this.socket = new Socket(this)
  }

  // Inicialización
  init () {
    this.game = window.gameSettings
    this.tone = this.sound.add('noteSound')
    this.profile = getProfile()
    this.bestScore = this.profile.games[this.game.id]?.bestScore ?? 0
    this.isNewRecord = false
    this.score = 0

    // Iniciar cronometro
    this.startTimer = Date.now()
  }

  // Principal
  create () {
    const { width: widthScreen, height: heightScreen } = this.cameras.main

    // Imagen de fondo, banner y Logo
    this.add
      .image(0, 0, 'bgGameScene')
      .setOrigin(0)
      .setDisplaySize(widthScreen, heightScreen)

    this.add
      .image(widthScreen / 2, 110, 'bannerGameScene')
      .setScale(0.7)

    this.add
      .image(widthScreen - 200, heightScreen / 2 + 5, 'scoreTableScene')
      .setScale(0.8)

    this.ui.init()
    this.health.draw(1)
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

    this.scoreText = this.add.text(width - 200, 350, this.score, {
      fontSize: '70px',
      fontFamily: FONTS.SECONDARY,
      color: '#ffffff'
    })
      .setOrigin(0.5, 0)

    const scoreLabel = this.add
      .text(width - 200, 430, 'Puntos', {
        fontSize: '32px',
        fontFamily: FONTS.SECONDARY,
        color: '#ffffff'
      }).setOrigin(0.5, 0)

    this.uiAnimations.slideInFromRight({
      targets: this.scoreText,
      duration: 250,
      delay: 600
    })
    this.uiAnimations.fadeIn({
      targets: scoreLabel,
      duration: 200,
      delay: 800
    })

    this.bestScoreText = this.add
      .text(width - 200, 650, this.bestScore, {
        fontSize: '70px',
        fontFamily: FONTS.SECONDARY,
        color: '#ffffff'
      })
      .setOrigin(0.5)

    const bestScoreLabel = this.add
      .text(width - 200, 730, 'Mejor puntaje', {
        fontSize: '32px',
        fontFamily: FONTS.SECONDARY,
        color: '#ffffff'
      }).setOrigin(0.5, 1)

    this.uiAnimations.slideInFromRight({
      targets: this.bestScoreText,
      duration: 200,
      delay: 600
    })
    this.uiAnimations.fadeIn({
      targets: bestScoreLabel,
      duration: 250,
      delay: 800
    })
  }

  // Ganar punto
  point () {
    this.score = this.score + 100
    this.scoreText.setText(this.score)

    this.uiAnimations.scaleUp({
      targets: this.scoreText,
      duration: 200,
      delay: 0
    })

    // Actualizar mejor puntaje
    if (this.score > this.bestScore) {
      this.isNewRecord = true
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

    const label = this.add.text(x, y + 110, 'Reproducir', {
      fontSize: '32px',
      fontFamily: FONTS.SECONDARY,
      color: '#ffffff'
    }).setOrigin(0.5)

    const button = Button.draw(this)({
      ...BUTTONS.LISTEN_MELODY,
      position: [x, y],
      withSound: false,
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

    this.uiAnimations.scaleUp({ targets: button })
    this.uiAnimations.fadeIn({ targets: label, delay: 400 })
  }

  // Botón: Comparar tono incrementado/disminuido
  toneChangeButtons () {
    const { INCREASED, DECREASED } = TONE_DIRECTIONS
    const { height } = this.cameras.main
    const [x, y] = [900, height / 2 + 50]
    const gap = 200

    // Tono aumentó
    const buttonIncreased = Button.draw(this)({
      ...{ key: 'btnInclinations', frame: 'ascending' },
      position: [x, y - gap],
      withInteractions: true,
      withSound: false,
      onClick: ({ button }) => this.verifyToneChange(INCREASED)
    })

    this.uiAnimations.slideInFromBottom({ targets: buttonIncreased, delay: 300 })

    const labelIncreased = this.add.text(x, y - gap + 110, 'Aumentó', {
      fontSize: '32px',
      fontFamily: FONTS.SECONDARY,
      color: '#ffffff'
    }).setOrigin(0.5)

    this.uiAnimations.fadeIn({ targets: labelIncreased, delay: 600 })

    // Tono disminuyó
    const buttonDecreased = Button.draw(this)({
      ...{ key: 'btnInclinations', frame: 'descending' },
      position: [x, y + gap],
      withInteractions: true,
      withSound: false,
      onClick: ({ button }) => this.verifyToneChange(DECREASED)
    })

    this.uiAnimations.slideInFromTop({ targets: buttonDecreased, delay: 300 })

    const labelDecreased = this.add.text(x, y + gap + 110, 'Disminuyó', {
      fontSize: '32px',
      fontFamily: FONTS.SECONDARY,
      color: '#ffffff'
    }).setOrigin(0.5)

    this.uiAnimations.fadeIn({ targets: labelDecreased, delay: 600 })
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
        alert.title = '¡Fin del juego!'
        alert.type = 'gameover'
        alert.image = 'gameLogo'
        alert.message = 'Has perdido todas tus vidas, ¡vuelve a intentarlo!'
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

      // Enviar al servidor
      if (isGameOver && this.isNewRecord) {
        this.socket.levelCompleted({
          bestScore: this.bestScore,
          time: calculateElapsedTime(this.startTimer)
        })
      }
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
