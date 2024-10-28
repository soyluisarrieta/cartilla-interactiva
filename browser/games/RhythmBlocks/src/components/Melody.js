export default class Melody {
  constructor (scene) {
    this.scene = scene
    this.current = null
    this.isPlaying = false
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
    melody.push(firstFigure)

    // Generar el resto de la melodía
    for (let i = 1; i < totalNotes; i++) {
      const randomFigure = weightedFigures[Math.floor(Math.random() * weightedFigures.length)]
      melody.push(randomFigure)
    }

    this.current = melody
    return melody
  }

  // Reproduce cada nota individualmente y devuelve una promesa
  playNote (figure, tempo, timeElapsed) {
    return new Promise(resolve => {
      const { name, duration, beats = 1 } = figure
      const beatInterval = duration * tempo / beats
      const isRestNote = name.includes('rest')

      this.scene.sound.play('timerTic')
      for (let i = 0; i < beats; i++) {
        setTimeout(() => {
          if (!this.isPlaying) {
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
    this.isPlaying = true
    let timeElapsed = 0

    // Reproduce cada figura secuencialmente
    for (const figure of figures) {
      if (!this.isPlaying) {
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
    this.isPlaying = false
  }

  // Comparar melodías
  compare (composition) {
    const mistakes = []
    const melody = this.current
    composition.forEach((note, i) => {
      if (note !== melody[i].name) {
        mistakes.push({ slot: i, expected: melody[i].name, got: note })
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
}
