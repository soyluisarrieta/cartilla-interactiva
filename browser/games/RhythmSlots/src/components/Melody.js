import { getProfile, setProfile } from '../../../../scripts/Profile.js'

export default class Melody {
  constructor (scene) {
    this.scene = scene
    this.btnPlay = null
    this.state = {
      isPlaying: false,
      timers: []
    }
    this.textureStates = {
      pending: 'exercise-pending',
      playing: 'exercise-playing',
      completed: 'exercise-completed'
    }
  }

  // Generar una melodía aleatoria
  generate () {
    const { maxSlots, figures } = this.scene.level
    const melody = []
    const weightedFigures = []

    // Aumentar probabilidad de figuras no-rest
    figures.forEach(figure => {
      const weight = figure.name.includes('rest') ? 1 : 3
      for (let i = 0; i < weight; i++) {
        weightedFigures.push(figure)
      }
    })

    // Seleccionar la primera figura que no sea una "rest"
    const firstFigure = weightedFigures.find(figure => !figure.name.includes('rest'))
    melody.push(firstFigure)

    // Generar el resto de la melodía
    for (let i = 1; i < maxSlots; i++) {
      const randomFigure = weightedFigures[Math.floor(Math.random() * weightedFigures.length)]
      melody.push(randomFigure)
    }
    return melody
  }

  // Reproducir la melodía generada
  playMelody (melody) {
    const { tempo } = window.gameSettings
    this.state.isPlaying = true
    this.state.timers = []
    let timeElapsed = 0

    this.scene.uiManager.disableFinishButton(true)

    // Reproducir el primer tic inmediatamente
    this.scene.sound.play('timerTic')

    // Temporizador del tic-tac
    const ticTimer = this.scene.time.addEvent({
      delay: tempo,
      callback: () => {
        this.scene.sound.play('timerTic')
      },
      loop: true
    })

    this.state.timers.push(ticTimer)

    melody.forEach((figure, i) => {
      const { duration, beats = 1 } = figure
      const timer = this.scene.time.delayedCall(timeElapsed, () => {
        // Reiniciar anterior intervalo
        if (i !== 0) {
          const prevInterval = this.scene.slot.intervalIndicators[i - 1]
          this.scene.slot.changeIntervalStatus(prevInterval, this.scene.slot.invervalTextures.normal)
            .setScale(0.4)
        }

        // Activar intervalo que está sonando
        const intervalActived = this.scene.slot.intervalIndicators[i]
        this.scene.slot.changeIntervalStatus(intervalActived, this.scene.slot.invervalTextures.actived)
          .setScale(0.5)

        if (!figure.name.endsWith('rest')) {
          this.scene.sound.play('noteSound')
          for (let beat = 1; beat < beats; beat++) {
            this.scene.time.delayedCall(tempo / beats * beat, () => {
              this.scene.sound.play('noteSound')
            })
          }
        }

        // Reiniciar texturas solo si es la última figura
        if (i === melody.length - 1) {
          ticTimer.remove(false)

          this.scene.time.delayedCall(tempo * duration, () => {
            this.state.isPlaying = false
            this.btnPlay.setScale(0.7)
            this.btnPlay.setTexture('uiButtons', 'listen-melody')
            const lastInterval = this.scene.slot.intervalIndicators[i]
            this.scene.slot.changeIntervalStatus(lastInterval, this.scene.slot.invervalTextures.normal)
              .setScale(0.4)

            // Habilitar botón de confirmar
            if (this.scene.slot.filledSlots) {
              this.scene.uiManager.disableFinishButton(false)
            }
          })
        }
      })

      // Guardar cada timer
      this.state.timers.push(timer)
      timeElapsed += duration * tempo
    })
  }

  // Detener la reproducción de la melodía
  stopMelody () {
    this.state.isPlaying = false

    // Cancelar todos los delayedCalls pendientes
    this.state.timers.forEach(timer => timer.remove(false))
    this.state.timers = []

    this.scene.slot.resetIntervals()

    // Habilitar botón de confirmar
    if (this.scene.slot.filledSlots) {
      this.scene.uiManager.disableFinishButton(false)
    }
  }

  // Verificar si la melodía compuesta es correcta
  checkMelody () {
    const userMelody = this.scene.config.slots.map(slot => slot.note)

    // Comprobar melodía
    const mistakes = []
    userMelody.forEach((note, i) => {
      if (note !== this.scene.currentExercise.melody[i].name) {
        mistakes.push({ slot: i, expected: this.scene.currentExercise.melody[i].name, got: note })
      }
    })

    this.scene.slot.resetIntervals()
    this.scene.slot.filledSlots = false

    // Melodía incorrecta
    if (mistakes.length > 0) {
      this.scene.sound.play('incorrectMelody')
      const updatepHealth = this.scene.health.miss()
      this.scene.uiManager.disableFinishButton(true)

      const isGameOver = updatepHealth === 0
      const isPlural = mistakes.length > 1 ? 's' : ''
      const alert = {
        title: '¡Nota incorrecta!',
        type: 'error',
        image: 'gameLogo',
        message: `Debes corregirla${isPlural}. ¡Te quedan ${updatepHealth} vidas!`
      }

      if (isGameOver) {
        alert.title = '¡Fin del juego'
        alert.type = 'default'
        alert.image = 'gameLogo'
        alert.message = 'Has perdido todas tus vidas, ¡pero puedes volver a intentarlo!'

        this.stopMelody()
        this.scene.sound.stopAll()
        this.scene.sound.play('gameOver')
      }

      const buttons = [
        {
          text: 'Volver a jugar',
          onClick: () => {
            this.scene.scene.start('GameScene', this.scene.level)
          }
        },
        {
          text: 'Niveles',
          onClick: () => {
            this.scene.scene.start('LevelSelectionScene')
          }
        }
      ]

      this.scene.alert.showAlert(alert.title, {
        type: alert.type,
        duration: 0,
        image: alert.image,
        message: alert.message,
        btnAccept: !isGameOver,
        buttons: isGameOver ? buttons : [],
        dismissible: false
      })

      mistakes.forEach(({ slot }) => {
        const notesFailed = this.scene.config.slots[slot]
        notesFailed.element.setTexture('slot')
        notesFailed.isFixed = false
      })

      // Seleccionar nota incorrecta
      const firstNoteFailed = this.scene.config.slots[mistakes[0].slot]
      this.scene.slot.selectSlot(firstNoteFailed)
      return null
    }

    // Melodía correcta
    this.scene.sound.play('perfectMelody')
    this.advanceToNextExercise('completed')
    this.scene.uiManager.disableFinishButton(true)
  }

  // Avanzar al siguiente ejercicio
  advanceToNextExercise (exerciseState) {
    this.scene.currentExercise.setState(exerciseState)

    // Duración del ejercicio actual
    this.scene.currentExercise.timer = this.scene.calculateElapsedTime(this.scene.exerciseStartTime)
    this.scene.exerciseStartTime = Date.now()

    // Encontrar el siguiente ejercicio
    const nextExerciseIndex = this.scene.exercises.indexOf(this.scene.currentExercise) + 1
    if (nextExerciseIndex < this.scene.exercises.length) {
      this.scene.currentExercise = this.scene.exercises[nextExerciseIndex]
      this.scene.currentExercise.setState('playing')
      this.scene.generatedMelody = this.scene.currentExercise.melody

      // Mostrar alerta
      this.scene.alert.showAlert('¡Perfecto!', {
        type: 'success',
        duration: 0,
        image: 'gameLogo',
        message: 'Has avanzado al siguiente ejercicio.',
        btnAccept: true
      })

      // Limpiar las notas en las casillas
      this.scene.config.slots.forEach(slot => {
        slot.note = null
        slot.element.setTexture('slot')
      })
      this.scene.slot.selectSlot(this.scene.config.slots[0])
    } else {
      this.stopMelody()
      this.scene.sound.stopAll()
      this.scene.sound.play('levelComplete')
      this.scene.alert.showAlert('¡Nivel finalizado!', {
        type: 'success',
        duration: 0,
        image: 'gameLogo',
        message: 'Puedes seguir practicando este nivel o cambiar a otra dificultad.',
        dismissible: false,
        buttons: [
          {
            text: 'Volver a jugar',
            onClick: () => {
              this.scene.scene.start('GameScene', this.scene.level)
            }
          },
          {
            text: 'Niveles',
            onClick: () => {
              this.scene.scene.start('LevelSelectionScene')
            }
          }
        ]
      })

      // Chequear nivel
      const profile = getProfile()
      const currentGame = profile.games[window.gameSettings.id]
      const currentLevel = this.scene.level
      currentLevel.timer = this.scene.calculateElapsedTime(this.scene.levelStartTime)

      const dataExercises = this.scene.exercises.map(({ timer, melody }) => ({ melody }))

      const data = {
        level: {
          name: currentLevel.name,
          totalTimer: currentLevel.timer
        },
        exercises: dataExercises
      }

      this.scene.socket.levelCompleted(data)
      currentLevel.isCompleted = true

      // Guardar progreso en el perfil
      profile.games[window.gameSettings.id] = currentGame
      setProfile(profile)
    }
  }
}
