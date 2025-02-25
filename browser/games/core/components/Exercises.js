import { EXERCISE } from '../constants.js'
import UIAnimations from '../UIAnimations.js'
import { calculateElapsedTime } from '../utils/calculateElapsedTime.js'

export default class Exercises {
  static gap = 90
  static position = [90, 200]

  constructor (scene) {
    this.scene = scene
    this.uiAnimations = new UIAnimations(scene)
    this.init()
  }

  // Inicial
  init () {
    this.timer = Date.now()
    this.current = null
    this.all = []
  }

  // Implementación
  create (totalExercises) {
    const { width } = this.scene.cameras.main
    const [x, y] = Exercises.position

    this.init()

    for (let index = 0; index < totalExercises; index++) {
      const positionX = width - x
      const positionY = y + (Exercises.gap * (index + 1))
      const exerciseElement = this.scene.add
        .image(positionX, positionY, EXERCISE.KEY, EXERCISE.PENDING)
        .setOrigin(0.5)

      this.all.push({
        index,
        playing: false,
        element: exerciseElement,
        setTexture: (frame) => {
          exerciseElement
            .setTexture(EXERCISE.KEY, frame)
            .setScale(1.3)
        }
      })

      const baseDelay = 300
      this.uiAnimations.slideInFromRight({
        targets: exerciseElement,
        duration: 300,
        delay: baseDelay + index * 120
      })
    }
  }

  // Cambiar ejercicio a estado jugando
  play (index) {
    const prevExercise = this.all.find((exercise) => exercise.playing)
    prevExercise && (prevExercise.playing = false)
    this.current = this.all[index]
    this.current.playing = true
    this.current.setTexture(EXERCISE.PLAYING)
    return this.current
  }

  // Completar y avanzar al siguiente ejercicio
  complete () {
    this.current.playing = false
    this.current.setTexture(EXERCISE.COMPLETED)
    this.current.timer = calculateElapsedTime(this.timer)

    const nextIndex = this.current.index + 1

    // Sin ejercicios
    if (!this.all[nextIndex]) {
      return null
    }

    // Siguiente ejercicio
    const nextExercise = this.play(nextIndex)
    this.timer = Date.now()
    return nextExercise
  }
}
