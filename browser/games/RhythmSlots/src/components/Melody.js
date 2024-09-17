export default class Melody {
  constructor (scene) {
    this.scene = scene
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
    this.scene.melodyState.isPlaying = true
    this.scene.melodyState.timers = []
    let timeElapsed = 0

    melody.forEach((figure, i) => {
      const { duration, beats } = figure
      const timer = this.scene.time.delayedCall(timeElapsed, () => {
        if (i !== 0) {
          this.scene.intervalIndicators[i - 1].setScale(0.2)
        }

        this.scene.intervalIndicators[i].setScale(0.3)

        if (beats && figure !== 'crotchetRest') {
          this.scene.sound.play('noteSound')
          for (let beat = 1; beat < beats; beat++) {
            this.scene.time.delayedCall(tempo / beats * beat, () => {
              this.scene.sound.play('noteSound')
            })
          }
        }

        // Establecer en false solo después de la última figura
        if (i === melody.length - 1) {
          this.scene.melodyState.isPlaying = false
          this.scene.btnPlayMelody.setScale(0.7)
          this.scene.btnPlayMelody.setTexture('uiMainMenu', 'button')
          this.scene.time.delayedCall(tempo * duration, () => {
            this.scene.intervalIndicators[i].setScale(0.2)
          })
        }
      })

      // Guardar cada timer
      this.scene.melodyState.timers.push(timer)
      timeElapsed += duration * tempo
    })
  }

  // Detener la reproducción de la melodía
  stopMelody () {
    this.scene.melodyState.isPlaying = false

    // Cancelar todos los delayedCalls pendientes
    this.scene.melodyState.timers.forEach(timer => timer.remove(false))
    this.scene.melodyState.timers = []

    // Reiniciar los indicadores de intervalo
    this.scene.intervalIndicators.forEach((interval) => interval.setScale(0.2))
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

    this.scene.btnFinish.setTexture('uiMainMenu', 'button')
    this.scene.filledSlots = false

    // Melodía incorrecta
    if (mistakes.length > 0) {
      this.advanceToNextExercise('failed')
      return null
    }

    // Melodía correcta
    this.advanceToNextExercise('completed')
  }

  // Avanzar al siguiente ejercicio
  advanceToNextExercise (exerciseState) {
    this.scene.currentExercise.setState(exerciseState)

    // Encontrar el siguiente ejercicio
    const nextExerciseIndex = this.scene.config.exercises.indexOf(this.scene.currentExercise) + 1
    if (nextExerciseIndex < this.scene.config.exercises.length) {
      this.scene.currentExercise = this.scene.config.exercises[nextExerciseIndex]
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
