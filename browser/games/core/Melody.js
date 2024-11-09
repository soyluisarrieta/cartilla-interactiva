import '/assets/lib/tone/tone.15.1.3.min.js'

export default class Melody {
  constructor (scene) {
    this.scene = scene
    this.tempo = null
    this.current = null
    this.playing = false
    this.paused = false
    this.timerTicInterval = null
  }

  // Generar una melodía aleatoria
  generate (figures, totalNotes) {
    const melody = []
    const weightedFigures = []

    // Aumentar probabilidad de figuras no-rest
    figures.forEach((figure) => {
      const weight = figure.name.includes('rest') ? 1 : 2
      for (let i = 0; i < weight; i++) {
        weightedFigures.push(figure)
      }
    })

    // Seleccionar la primera figura que no sea una "rest"
    const firstFigure = weightedFigures.find((figure) => !figure.name.includes('rest'))
    melody.push({ ...firstFigure, index: 0 })

    // Generar el resto de la melodía
    for (let i = 1; i < totalNotes; i++) {
      const randomFigure = weightedFigures[Math.floor(Math.random() * weightedFigures.length)]
      melody.push({ ...randomFigure, index: i })
    }

    this.current = melody
    return melody
  }

  // Iniciar temporizador
  startTimerTic () {
    this.scene.sound.play('timerTic')
    this.timerTicInterval = setInterval(() => {
      if (this.playing) {
        this.scene.sound.play('timerTic')
      }
    }, this.tempo)
  }

  // Detener temporizador
  stopTimerTic () {
    clearInterval(this.timerTicInterval)
  }

  // Reproduce una figura musical o combinadas
  playNote (figure, timeElapsed, onSound) {
    if (figure.figures) {
      return this.playSubfigures(figure.figures, timeElapsed, onSound)
    } else {
      return new Promise(resolve => {
        const { name, duration, beats = 1 } = figure
        const beatInterval = duration * this.tempo / beats
        const isRestNote = name.includes('rest')

        for (let i = 0; i < beats; i++) {
          setTimeout(() => {
            if (!this.playing || this.paused) {
              resolve()
              return
            }

            if (!isRestNote) {
              this.scene.sound.play('noteSound', { timeElapsed })
            }

            // Llamar callback
            onSound()
          }, i * beatInterval)
        }

        // Resuelve la promesa después del tiempo total
        setTimeout(() => {
          resolve()
        }, duration * this.tempo)
      })
    }
  }

  // Reproducir subfiguras secuencialmente
  async playSubfigures (subfigures, timeElapsed, onSound) {
    for (const subfigure of subfigures) {
      await this.playNote(subfigure, timeElapsed, onSound)
      timeElapsed += subfigure.duration * this.tempo
    }
  }

  // Reproducir ritmo usando asincronía
  async play (figures, tempo, onSound = () => {}) {
    this.playing = true
    let timeElapsed = 0
    let index = 0
    this.tempo = tempo
    this.startTimerTic()

    // Reproduce cada figura secuencialmente
    for (const figure of figures) {
      while (this.paused) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      if (!this.playing) {
        break
      }

      // Detener temporizador si es la última figura
      if (figure.index === figures.length - 1) {
        this.stopTimerTic()
      }

      // Reproducir nota
      await this.playNote(figure, timeElapsed, () => onSound({ figure, index }))
      timeElapsed += figure.duration * this.tempo
      index++
    }

    // Finaliza la reproducción
    this.stop()
  }

  // Pausar reproducción
  pause () {
    this.paused = true
    this.stopTimerTic()
  }

  // Reanudar reproducción
  resume () {
    this.paused = false
    if (this.playing) {
      this.startTimerTic(this.tempo)
    }
  }

  // Detener reproducción
  stop () {
    this.playing = false
    this.paused = false
    this.stopTimerTic()
  }

  // Comprobar si la melodía es correcta
  check (composition) {
    const mistakes = []
    const melody = this.current
    composition.forEach((figure, i) => {
      if (figure.name !== melody[i].name) {
        mistakes.push({ index: i, expected: melody[i].name, got: figure.name })
      }
    })

    // Manejar errores y notificaciones
    if (mistakes.length > 0) {
      this.scene.sound.play('incorrectMelody')
      return mistakes
    } else {
      this.scene.sound.play('perfectMelody')
      return null
    }
  }

  // Dividir melodía en grupos
  divide (melody, groupSize) {
    const groups = []
    for (let i = 0; i < melody.length; i += groupSize) {
      groups.push(melody.slice(i, i + groupSize))
    }
    return groups
  }
}
