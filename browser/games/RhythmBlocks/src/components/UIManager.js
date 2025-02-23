import { getProfile, setProfile } from '../../../../scripts/profile.js'
import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import { calculateElapsedTime } from '../../../core/utils/calculateElapsedTime.js'
import { UI } from '../constants.js'

export default class UIManager {
  static title = 'GAME SCENE'
  static explanation = 'Escucha la melodía, mueve cada bloque de la melodía a su correspondiente casilla.'

  constructor (scene) {
    this.scene = scene
  }

  // Implementación
  init () {
    this.homeButton()
    this.setTitle(UIManager.title)
    this.melodyButton()
    this.confirmButton()
  }

  // Botón: Salir de la partida
  homeButton () {
    Button.draw(this.scene)({
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
  }

  // Títular
  setTitle (text) {
    const { width } = this.scene.cameras.main
    return this.scene.add.text(width / 2, 100, text, {
      fontSize: '70px',
      fontFamily: FONTS.PRIMARY,
      color: '#ffffff'
    }).setOrigin(0.5, 0)
  }

  // Botón: Reproducir melodía
  melodyButton () {
    const { tempo } = window.gameSettings
    const { width, height } = this.scene.cameras.main

    const x = width - 360
    const y = height - 170

    const label = this.scene.add.text(x, y + 110, 'Melodía', {
      fontSize: '32px',
      fontFamily: FONTS.SECONDARY,
      color: '#ffffff'
    }).setOrigin(0.5)

    Button.draw(this.scene)({
      ...BUTTONS.LISTEN_MELODY,
      position: [x, y],
      withSound: false,
      withInteractions: false,
      onClick: async ({ button }) => {
        if (!this.scene.melody.playing) {
          label.setText('Detener')
          button.setTexture(BUTTONS.REPEAT.key, BUTTONS.REPEAT.frame)
          const melody = this.scene.melody.current
          await this.scene.melody.play(melody, tempo)
        }
        this.scene.melody.stop()
        label.setText('Melodía')
        button.setTexture(BUTTONS.LISTEN_MELODY.key, BUTTONS.LISTEN_MELODY.frame)
      }
    })
  }

  // Botón: Confirmar melodía
  confirmButton () {
    const { width, height } = this.scene.cameras.main
    const x = width - 150
    const y = height - 170

    const button = Button.draw(this.scene)({
      ...BUTTONS.CONFIRM,
      position: [x, y],
      onClick: ({ button }) => {
        this.scene.melody.stop()
        const groupedMelody = this.scene.slots.map(slot => (
          slot.currentBlock.figures
        ))

        // Verificar si la composición es incorrecta
        const composition = []
        groupedMelody.forEach((figures, blockIndex) => {
          figures.forEach((figure) => {
            composition.push({ ...figure.getData('figure'), blockIndex })
          })
        })

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

          // Mostar las notas incorrectas
          const totalFigures = this.scene.level.metrics.figures
          const mistateBlocksByFigures = mistakes.map((mistake) => Math.floor(mistake.index / totalFigures))
          const mistakeBlocks = [...new Set(mistateBlocksByFigures)]
          mistakeBlocks.forEach((indexBlock) => {
            this.scene.slots[indexBlock].currentBlock.blockImage
              .setTexture(UI.BLOCKS.KEY, UI.BLOCKS.BLOCK(`${totalFigures}-bad`))
          })

          return null
        }

        // Composición correcta
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
        this.scene.exercises.play(nextExercise.index)
        this.scene.start()
        button.setDisabled(true)
      }
    })

    const label = this.scene.add.text(x, y + 110, 'Confirmar', {
      fontSize: '32px',
      fontFamily: FONTS.SECONDARY,
      color: '#ffffff'
    }).setOrigin(0.5)

    const setDisabled = (disable) => {
      button.setDisabled(disable)
      label.setAlpha(disable ? 0.5 : 1)
    }

    setDisabled(true)
    this.scene.confirmButton = { setDisabled }
  }
}
