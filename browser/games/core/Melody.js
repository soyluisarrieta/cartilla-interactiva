export default class Melody {
  constructor (scene) {
    this.scene = scene
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
  startTimerTic (tempo) {
    this.scene.sound.play('timerTic')
    this.timerTicInterval = setInterval(() => {
      if (this.playing) {
        this.scene.sound.play('timerTic')
      }
    }, tempo)
  }

  // Detener temporizador
  stopTimerTic () {
    clearInterval(this.timerTicInterval)
  }

  // Reproduce una figura musical o combinadas
  playNote (figure, tempo, timeElapsed, onSound) {
    if (figure.figures) {
      return this.playSubfigures(figure.figures, tempo, timeElapsed, onSound)
    } else {
      return new Promise(resolve => {
        const { name, duration, beats = 1 } = figure
        const beatInterval = duration * tempo / beats
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
        }, duration * tempo)
      })
    }
  }

  // Reproducir subfiguras secuencialmente
  async playSubfigures (subfigures, tempo, timeElapsed, onSound) {
    for (const subfigure of subfigures) {
      await this.playNote(subfigure, tempo, timeElapsed, onSound)
      timeElapsed += subfigure.duration * tempo
    }
  }

  // Reproducir ritmo usando asincronía
  async play (figures, tempo, onSound = () => {}) {
    this.playing = true
    let timeElapsed = 0
    let index = 0
    this.startTimerTic(tempo)

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
      await this.playNote(figure, tempo, timeElapsed, () => onSound({ figure, index }))
      timeElapsed += figure.duration * tempo
      index++
    }

    // Finaliza la reproducción
    this.stop()
  }

  // Pausar reproducción
  pause () {
    this.paused = true
  }

  // Reanudar reproducción
  resume () {
    this.paused = false
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
