export default class Melody {
  constructor (gameScene) {
    this.game = gameScene
    this.btnPlay = null
    this.state = {
      isPlaying: false,
      timers: []
    }
    this.textureStates = {
      playing: 'button',
      failed: 'button-pressed',
      completed: 'button-hovered'
    }
  }

  // Generar una melodía aleatoria
  generate () {
    const { maxSlots, figures } = this.game.config
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
    const { tempo } = this.game.settings
    this.state.isPlaying = true
    this.state.timers = []
    let timeElapsed = 0

    this.game.uiManager.disableFinishButton(true)

    melody.forEach((figure, i) => {
      const { duration, beats } = figure
      const timer = this.game.time.delayedCall(timeElapsed, () => {
        // Reiniciar anterior intervalo
        if (i !== 0) {
          const prevInterval = this.game.slot.intervalIndicators[i - 1]
          this.game.slot.changeIntervalStatus(prevInterval, 'normal')
            .setScale(0.2)
        }

        // Activar invervalo que está sonando
        const intervalActived = this.game.slot.intervalIndicators[i]
        this.game.slot.changeIntervalStatus(intervalActived, 'actived')
          .setScale(0.3)

        if (beats && figure !== 'crotchetRest') {
          this.game.sound.play('noteSound')
          for (let beat = 1; beat < beats; beat++) {
            this.game.time.delayedCall(tempo / beats * beat, () => {
              this.game.sound.play('noteSound')
            })
          }
        }

        // Reiniciar texturas solo si es la última figura
        if (i === melody.length - 1) {
          this.game.time.delayedCall(tempo * duration, () => {
            this.state.isPlaying = false
            this.btnPlay.setScale(0.7)
            this.btnPlay.setTexture('uiMainMenu', 'button')
            const lastInterval = this.game.slot.intervalIndicators[i]
            this.game.slot.changeIntervalStatus(lastInterval, 'normal')
              .setScale(0.2)

            // Habilitar botón de confirmar
            if (this.game.slot.filledSlots) {
              this.game.uiManager.disableFinishButton(false)
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

    this.game.slot.resetIntervals()

    // Habilitar botón de confirmar
    if (this.game.slot.filledSlots) {
      this.game.uiManager.disableFinishButton(false)
    }
  }

  // Verificar si la melodía compuesta es correcta
  checkMelody () {
    const userMelody = this.game.config.slots.map(slot => slot.note)

    // Comprobar melodía
    const mistakes = []
    userMelody.forEach((note, i) => {
      if (note !== this.game.currentExercise.melody[i].name) {
        mistakes.push({ slot: i, expected: this.game.currentExercise.melody[i].name, got: note })
      }
    })

    this.game.slot.resetIntervals()
    this.game.slot.filledSlots = false

    // Melodía incorrecta
    if (mistakes.length > 0) {
      this.game.attempts.update(-1)
      this.game.uiManager.disableFinishButton(true)

      const countAttempts = this.game.attempts.total
      const isGameOver = countAttempts === 0
      const firstPartMsg = mistakes.length > 1
        ? 'Algunas de las notas son incorrectas. Debes corregirlas'
        : 'Una de las notas es incorrecta. Debes corregirla'
      const alert = {
        title: '¡Nota incorrecta!',
        type: 'error',
        image: 'gameLogo',
        message: `${firstPartMsg} para continuar. ¡Te quedan ${countAttempts} vidas!`
      }

      if (isGameOver) {
        alert.title = '¡Fin del juego'
        alert.type = 'default'
        alert.image = 'gameLogo'
        alert.message = 'Has perdido todas tus vidas, ¡pero puedes volver a intentarlo!'
      }
      const buttons = [
        {
          text: 'Volver a jugar',
          onClick: () => {
            this.game.scene.start('GameScene', this.game.selectedLevel)
          }
        },
        {
          text: 'Niveles',
          onClick: () => {
            this.game.scene.start('LevelSelectionScene')
          }
        }
      ]

      this.game.alert.showAlert(alert.title, {
        type: alert.type,
        duration: 0,
        image: alert.image,
        message: alert.message,
        btnAccept: !isGameOver,
        buttons: isGameOver ? buttons : [],
        dismissible: !isGameOver
      })

      mistakes.forEach(({ slot }) => {
        const notesFailed = this.game.config.slots[slot]
        notesFailed.element.setTexture('slot')
        notesFailed.isFixed = false
      })

      // Seleccionar nota incorrecta
      const firstNoteFailed = this.game.config.slots[mistakes[0].slot]
      this.game.slot.selectSlot(firstNoteFailed)
      return null
    }

    // Melodía correcta
    this.advanceToNextExercise('completed')
    this.game.uiManager.disableFinishButton(true)
  }

  // Avanzar al siguiente ejercicio
  advanceToNextExercise (exerciseState) {
    this.game.currentExercise.setState(exerciseState)

    // Duración del ejercicio actual
    this.game.currentExercise.timer = this.game.calculateElapsedTime(this.game.exerciseStartTime)
    this.game.exerciseStartTime = Date.now()

    // Encontrar el siguiente ejercicio
    const nextExerciseIndex = this.game.exercises.indexOf(this.game.currentExercise) + 1
    if (nextExerciseIndex < this.game.exercises.length) {
      this.game.currentExercise = this.game.exercises[nextExerciseIndex]
      this.game.currentExercise.setState('playing')
      this.game.generatedMelody = this.game.currentExercise.melody

      // Limpiar las notas en las casillas
      this.game.config.slots.forEach(slot => {
        slot.note = null
        slot.element.setTexture('slot')
      })
      this.game.slot.selectSlot(this.game.config.slots[0])
    } else {
      this.game.alert.showAlert('¡Nivel finalizado!', {
        type: 'success',
        duration: 0,
        image: 'gameLogo',
        message: 'Puedes seguir practicando este nivel o cambiar a otra dificultad.',
        buttons: [
          {
            text: 'Volver a jugar',
            onClick: () => {
              this.game.scene.start('GameScene', this.game.selectedLevel)
            }
          },
          {
            text: 'Niveles',
            onClick: () => {
              this.game.scene.start('LevelSelectionScene')
            }
          }
        ]
      })

      // Chequear nivel
      const selectedLevel = this.game.selectedLevel
      const currentLevel = this.game.settings.levels[selectedLevel - 1]
      currentLevel.timer = this.game.calculateElapsedTime(this.game.levelStartTime)
      this.game.socket.sendLevelData(currentLevel)
      currentLevel.isCompleted = true
    }
  }
}
