export default class Melody {
  constructor (scene) {
    this.scene = scene
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
    const { maxSlots, figures } = this.scene.config
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
    const { tempo } = this.scene.settings
    this.state.isPlaying = true
    this.state.timers = []
    let timeElapsed = 0

    this.scene.uiManager.disableFinishButton(true)

    melody.forEach((figure, i) => {
      const { duration, beats } = figure
      const timer = this.scene.time.delayedCall(timeElapsed, () => {
        // Reiniciar anterior intervalo
        if (i !== 0) {
          const prevInterval = this.scene.slot.intervalIndicators[i - 1]
          this.scene.slot.changeIntervalStatus(prevInterval, 'normal')
            .setScale(0.2)
        }

        // Activar invervalo que está sonando
        const intervalActived = this.scene.slot.intervalIndicators[i]
        this.scene.slot.changeIntervalStatus(intervalActived, 'actived')
          .setScale(0.3)

        if (beats && figure !== 'crotchetRest') {
          this.scene.sound.play('noteSound')
          for (let beat = 1; beat < beats; beat++) {
            this.scene.time.delayedCall(tempo / beats * beat, () => {
              this.scene.sound.play('noteSound')
            })
          }
        }

        // Reiniciar texturas solo si es la última figura
        if (i === melody.length - 1) {
          this.scene.time.delayedCall(tempo * duration, () => {
            this.state.isPlaying = false
            this.btnPlay.setScale(0.7)
            this.btnPlay.setTexture('uiMainMenu', 'button')
            const lastInterval = this.scene.slot.intervalIndicators[i]
            this.scene.slot.changeIntervalStatus(lastInterval, 'normal')
              .setScale(0.2)
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

    // Melodía incorrecta
    if (mistakes.length > 0) {
      mistakes.forEach(({ slot }) => {
        const intervalFailed = this.scene.slot.intervalIndicators[slot]
        this.scene.slot.changeIntervalStatus(intervalFailed, 'failed')
      })
      this.scene.attempts.update(-1)
      this.scene.uiManager.disableFinishButton(true)
      return null
    }

    // Melodía correcta
    this.advanceToNextExercise('completed')
  }

  // Avanzar al siguiente ejercicio
  advanceToNextExercise (exerciseState) {
    this.scene.currentExercise.setState(exerciseState)

    // Encontrar el siguiente ejercicio
    const nextExerciseIndex = this.scene.exercises.indexOf(this.scene.currentExercise) + 1
    if (nextExerciseIndex < this.scene.exercises.length) {
      this.scene.currentExercise = this.scene.exercises[nextExerciseIndex]
      this.scene.currentExercise.setState('playing')
      this.scene.generatedMelody = this.scene.currentExercise.melody

      // Limpiar las notas en las casillas
      this.scene.config.slots.forEach(slot => {
        slot.note = null
        slot.element.setTexture('slot')
      })
      this.scene.slot.selectSlot(this.scene.config.slots[0])
    } else {
      this.scene.alert.showAlert('¡Nivel finalizado!', {
        type: 'success',
        duration: 0,
        image: 'gameLogo',
        message: 'Puedes seguir practicando este nivel o cambiar a otra dificultad.',
        buttons: [
          {
            text: 'Volver a jugar',
            onClick: () => {
              this.scene.scene.start('GameScene', this.scene.selectedLevel)
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
    }
  }
}
