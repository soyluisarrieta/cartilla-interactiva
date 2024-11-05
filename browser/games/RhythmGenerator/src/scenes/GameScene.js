import Melody from '../../../core/Melody.js'
import UIManager from '../components/UIManager.js'
import UIAnimations from '../../../core/UIAnimations.js'
import Intervals from '../components/Intervals.js'
import { grid } from '../../../core/utils/grid.js'
import { SCENES } from '../../../core/constants.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })

    this.ui = new UIManager(this)
    this.melody = new Melody(this)
    this.uiAnimations = new UIAnimations(this)
    this.intervals = new Intervals(this)
  }

  // Inicialización
  init (level) {
    this.game = window.gameSettings
    this.level = this.game.levels[0]
    this.intervals.init()
    this.composition = {
      figures: this.add.group(),
      intervals: []
    }

    UIManager.title = this.level.title
  }

  // Principal
  create () {
    this.ui.init()
    this.start()

    // Sonido de inicio de partida
    this.sound.stopAll()
    this.sound.play('startGame')
  }

  // Iniciar ejercicio
  start () {
    const { figures, metrics } = this.level
    const maxFigures = metrics.compass * metrics.figures

    this.composition.figures.clear(true, true)
    this.intervals.resetAll()

    const generatedMelody = this.melody.generate(figures, maxFigures)
    this.drawMelody(generatedMelody)
  }

  // Implementar melodía
  drawMelody (melody) {
    const { width } = this.cameras.main
    const { metrics: { compass, figures: notesPerColumn } } = this.level
    const numberOfCompasses = Math.ceil(melody.length / (compass * notesPerColumn))
    const figureWidth = 55
    const gapPerNotes = 20

    // Distribuir figuras por compás
    grid({
      element: ({ x, y }, i) => {
        const compassIndex = Math.floor(i / compass)
        const figureIndexInCompass = i % compass

        // Mostrar figuras en el compás
        for (let j = 0; j < notesPerColumn; j++) {
          const noteIndex = (compassIndex * compass + figureIndexInCompass) * notesPerColumn + j
          if (noteIndex >= melody.length) {
            return
          }

          const note = melody[noteIndex]
          const posX = x + ((figureWidth + gapPerNotes) * j)

          const image = this.add
            .image(posX, y, 'figures', note.name)
            .setOrigin(0)

          const aspectRatio = image.height / image.width
          const fixedHeight = figureWidth * aspectRatio
          image.setDisplaySize(figureWidth, fixedHeight)

          const posInterval = [posX + 25, y + 200]
          const intervalIndicator = this.intervals.draw(posInterval)

          this.composition.figures.add(image)
          this.composition.intervals.push(intervalIndicator)
        }
      },
      totalItems: numberOfCompasses * compass,
      item: { width: (figureWidth + gapPerNotes) * notesPerColumn },
      maxColumns: compass,
      gap: figureWidth,
      position: [width / 2, 500],
      alignCenter: true
    })
  }
}
