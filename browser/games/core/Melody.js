export default class Melody {
  constructor (scene) {
    this.scene = scene
    this.current = null
    this.playing = false
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

  // Reproduce cada nota individualmente y devuelve una promesa
  playNote (figure, tempo, timeElapsed) {
    return new Promise(resolve => {
      const { name, duration, beats = 1 } = figure
      const beatInterval = duration * tempo / beats
      const isRestNote = name.includes('rest')

      for (let i = 0; i < beats; i++) {
        setTimeout(() => {
          if (!this.playing) {
            resolve()
            return
          }
          !isRestNote && this.scene.sound.play('noteSound', { timeElapsed })
        }, i * beatInterval)
      }

      setTimeout(() => {
        resolve()
      }, duration * tempo)
    })
  }

  // Reproducir ritmo usando asincronía
  async play (figures, tempo) {
    this.playing = true
    let timeElapsed = 0
    this.startTimerTic(tempo)

    // Reproduce cada figura secuencialmente
    for (const figure of figures) {
      if (!this.playing) {
        break
      }
      await this.playNote(figure, tempo, timeElapsed)
      timeElapsed += figure.duration * tempo
    }

    // Finaliza la reproducción
    this.stop()
  }

  // Detener reproducción
  stop () {
    this.playing = false
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
