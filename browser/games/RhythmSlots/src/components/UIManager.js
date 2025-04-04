import { getProfile, setProfile } from '../../../../scripts/profile.js'
import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import { addInteractions } from '../../../core/utils/addInteractions.js'
import { calculateElapsedTime } from '../../../core/utils/calculateElapsedTime.js'

export default class UIManager {
  constructor (scene) {
    this.scene = scene
    this.confirmButton = {}
    this.currentExercise = null
  }

  init () {
    this.melodyButton()
    this.drawExitButton()
    this.drawLevelInfo()
    this.drawNoteButtons()
    this.drawConfirmButton()
  }

  // Dibujar botón
  drawButton ({ key, frame, scene, position: { x, y }, withInteractions = true }) {
    const button = this.scene.add.image(x, y, frame, key)
      .setOrigin(0.5)
      .setInteractive()

    const navigate = () => {
      this.scene.sound.play('soundPress')
      this.scene.scene.start(scene)
    }

    if (withInteractions) {
      addInteractions({
        button,
        key: frame,
        frame: key,
        onClick: navigate
      })
    } else {
      button.on('pointerup', navigate)
    }

    return button
  }

  // Botón para ir atrás
  drawBackButton (scene = 'MenuScene') {
    return this.drawButton({
      key: 'back-btn',
      frame: 'btnBack',
      scene,
      position: { x: 150, y: 120 }
    })
  }

  // Crear botón para regresar a la selección de niveles
  drawHomeButton (scene = 'MenuScene') {
    return this.drawButton({
      key: 'home',
      frame: 'uiButtons',
      scene,
      position: { x: 120, y: 120 },
      withInteractions: false
    })
  }

  // Botón: Salir de la partida
  drawExitButton () {
    const button = Button.draw(this.scene)({
      ...BUTTONS.HOME,
      position: [120, 120],
      onClick: () => {
        this.scene.melody.stop()
        this.scene.alert.showAlert('¿Estás seguro?', {
          type: 'warning',
          image: 'gameLogo',
          message: 'Si sales, tendrás que volver a empezar una nueva partida.',
          buttons: [
            {
              text: 'Salir',
              onClick: () => {
                this.scene.melody.stop()
                this.scene.scene.start(SCENES.MENU)
              }
            },
            { text: 'Cancelar' }
          ]
        })
      }
    }).setScale(0.9)

    this.scene.uiAnimations.fadeIn({
      targets: button,
      duration: 300,
      delay: 300
    })
  }

  // Mostrar la información del nivel actual
  drawLevelInfo () {
    this.scene.add.text(this.scene.screen.width / 2, 70, 'Encuentra el ritmo correcto', {
      fontSize: '90px',
      fontFamily: FONTS.PRIMARY,
      color: '#ffffff'
    }).setOrigin(0.5, 0)
  }

  // Mostrar los botones para seleccionar notas
  drawNoteButtons () {
    const layout = { gap: 20, marginTop: 800, marginRight: 150 }
    const { figures } = this.scene.level
    const totalWidth = figures.length * layout.gap + (figures.length - 1) * 100
    const startX = (this.scene.screen.width - totalWidth - layout.marginRight) / 2 + layout.gap / 2
    const position = { x: startX, y: layout.marginTop }

    figures.forEach((figure, index) => {
      const btnNote = this.scene.add
        .image(position.x, position.y, 'btnFigures', `btn-${figure.name}`)
        .setScale(0.8)
        .setOrigin(0.5)
        .setInteractive()

      position.x += layout.gap + 100

      addInteractions({
        button: btnNote,
        key: 'btnFigures',
        frame: `btn-${figure.name}`,
        onClick: () => this.scene.slot.handleNoteSelection(figure, index)
      })

      const baseDelay = 200
      this.scene.uiAnimations.scaleUp({
        targets: btnNote,
        duration: 600,
        delay: baseDelay + index * 100,
        endScale: 0.8
      })
    })
  }

  // Botón: Reproducir melodía
  melodyButton () {
    const { tempo } = window.gameSettings
    const { width, height } = this.scene.cameras.main

    const x = width - 380
    const y = height - 170

    const label = this.scene.add.text(x, y + 110, 'Melodía', {
      fontSize: '32px',
      fontFamily: FONTS.SECONDARY,
      color: '#ffffff'
    }).setOrigin(0.5)

    const button = Button.draw(this.scene)({
      ...BUTTONS.LISTEN_MELODY,
      position: [x, y],
      withSound: false,
      onClick: async ({ button }) => {
        if (!this.scene.melody.playing) {
          const melody = this.scene.melody.current
          const onSound = this.onInterval.bind(this)
          await this.scene.melody.play(melody, tempo, onSound)
        }

        this.scene.slot.resetIntervals()
        this.scene.melody.stop()
      }
    })

    const baseDelay = 400
    this.scene.uiAnimations.slideInFromBottom({
      targets: button,
      duration: 700,
      delay: baseDelay + 100
    })
    this.scene.uiAnimations.fadeIn({
      targets: label,
      duration: 350,
      delay: baseDelay + 700
    })
  }

  // Mostrar los botones de acción
  drawConfirmButton () {
    const { width, height } = this.scene.cameras.main

    const x = width - 200
    const y = height - 170

    const label = this.scene.add.text(x, y + 110, 'Confirmar', {
      fontSize: '32px',
      fontFamily: FONTS.SECONDARY,
      color: '#ffffff'
    }).setOrigin(0.5)

    const button = Button.draw(this.scene)({
      ...BUTTONS.CONFIRM,
      position: [x, y],
      disabled: true,
      withSound: false,
      onClick: async ({ button }) => {
        this.disableFinishButton(true)
        this.scene.melody.stop()

        // Verificar si la composición es incorrecta
        const composition = this.scene.slots.map(({ figure }) => figure)
        const mistakes = this.scene.melody.check(composition)

        if (mistakes) {
          const totalHealth = this.scene.health.miss()
          const isGameOver = totalHealth === 0
          const isPlural = mistakes.length > 1 ? 's' : ''
          const alert = {
            title: '¡Composición incorrecta!',
            type: 'error',
            image: 'gameLogo',
            message: `Debes corregir la${isPlural} nota${isPlural}. ¡Te quedan ${totalHealth} vidas!`
          }

          if (isGameOver) {
            alert.title = '¡Fin del juego!'
            alert.type = 'gameover'
            alert.image = 'gameLogo'
            alert.message = 'Has perdido todas tus vidas, ¡vuelve a intentarlo!'

            this.scene.melody.stop()
            this.scene.sound.stopAll()
            this.scene.sound.play('gameOver')
          }

          const buttons = [
            {
              text: 'Volver a jugar',
              onClick: () => {
                this.scene.scene.start(SCENES.GAME, this.scene.level)
              }
            },
            {
              text: 'Ir a niveles',
              onClick: () => {
                this.scene.scene.start(SCENES.LEVEL_SELECTION)
              }
            }
          ]

          this.scene.alert.showAlert(alert.title, {
            type: alert.type,
            image: alert.image,
            message: alert.message,
            btnAccept: !isGameOver,
            buttons: isGameOver ? buttons : [],
            dismissible: false
          })

          // Mostrar las notas incorrectas
          mistakes.forEach(({ index }) => {
            const notesFailed = this.scene.slots[index]
            notesFailed.element.setTexture('slot')
            notesFailed.isFixed = false
          })

          // Seleccionar nota incorrecta
          const firstNoteFailed = this.scene.slots[mistakes[0].index]
          this.scene.slot.selectSlot(firstNoteFailed)

          return null
        }

        // Melodía correcta
        this.scene.sound.play('perfectMelody')
        this.advanceToNextExercise()
      }
    })

    this.confirmButton = { button, label }

    // Animations
    const baseDelay = 400
    this.scene.uiAnimations.slideInFromBottom({
      targets: button,
      duration: 700,
      delay: baseDelay + 100,
      endAlpha: 0.4
    })
    this.scene.uiAnimations.fadeIn({
      targets: label,
      duration: 350,
      delay: baseDelay + 700,
      endAlpha: 0.4
    })
  }

  disableFinishButton (state = true) {
    this.confirmButton.label.alpha = state ? 0.4 : 1
    this.confirmButton.button.setDisabled(state)
    this.scene.slot.filledSlots = !state
  }

  onInterval ({ index }) {
    const { slot } = this.scene

    // Reiniciar anterior intervalo
    if (index !== 0) {
      const prevInterval = slot.intervalIndicators[index - 1]
      slot.changeIntervalStatus(prevInterval, slot.invervalTextures.normal)
    }

    // Activar intervalo que está sonando
    const intervalActived = slot.intervalIndicators[index]
    slot.changeIntervalStatus(intervalActived, slot.invervalTextures.actived)
  }

  // Avanzar al siguiente ejercicio
  advanceToNextExercise () {
    this.scene.exercises.current.melody = this.scene.melody.current
    const nextExercise = this.scene.exercises.complete()

    // Nivel completado
    if (!nextExercise) {
      this.scene.sound.stopAll()
      this.scene.sound.play('levelComplete')

      this.scene.alert.showAlert('¡Nivel finalizado!', {
        type: 'completed',
        image: 'gameLogo',
        message: '¡Bien hecho! continua aprendiendo.',
        dismissible: false,
        buttons: [
          {
            text: 'Volver a jugar',
            onClick: () => {
              this.scene.scene.restart()
            }
          },
          {
            text: 'Ir a niveles',
            onClick: () => {
              this.scene.scene.start(SCENES.LEVEL_SELECTION)
            }
          }
        ]
      })

      // Guardar progreso
      const exercises = this.scene.exercises.all.map(({ melody, timer }) => ({ melody, timer }))
      this.scene.socket.levelCompleted({
        level: {
          name: this.scene.level.name,
          totalTimer: calculateElapsedTime(this.scene.levelStartTimer)
        },
        exercises
      })

      const currentLevel = this.scene.level
      const profile = getProfile()
      const profileLevel = profile.games[profile.playing].levels[currentLevel.index]
      profileLevel.completed = true
      setProfile(profile)

      return null
    }

    // Siguiente ejercicio
    this.scene.alert.showAlert('¡Perfecto!', {
      type: 'success',
      image: 'gameLogo',
      message: 'Has avanzado al siguiente ejercicio.',
      btnAccept: true
    })

    // Ejecutar siguiente ejercicio
    const { figures, maxSlots } = this.scene.level
    this.scene.melody.generate(figures, maxSlots)
    this.scene.exercises.play(nextExercise.index)
    this.disableFinishButton(true)
    this.scene.slots.forEach(slot => {
      slot.figure = null
      slot.note = null
      slot.element.setTexture('slot')
    })
    this.scene.slot.selectSlot(this.scene.slots[0])
  }
}
