import Alert from '../../../core/components/Alert.js'
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
    this.alert = new Alert(this)
    this.melody = new Melody(this)
    this.uiAnimations = new UIAnimations(this)
    this.intervals = new Intervals(this)
  }

  // Inicialización
  init (level) {
    this.game = window.gameSettings
    this.level = level
    this.intervals.init()
    this.composition = this.add.group()

    UIManager.title = this.level.title
  }

  // Principal
  create () {
    const { width: widthScreen, height: heightScreen } = this.cameras.main

    // Imagen de fondo, banner y Logo
    this.add
      .image(0, 0, 'bgGameScene')
      .setOrigin(0)
      .setDisplaySize(widthScreen, heightScreen)

    this.add
      .image(widthScreen / 2, 110, 'bannerGameScene')
      .setOrigin(0.5)
      .setScale(0.63)

    this.add
      .image(widthScreen / 2, 320, 'bannerFigures1')
      .setScale(1.2)

    this.add
      .image(widthScreen / 2, 600, 'bannerFigures2')
      .setScale(1.2)

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

    this.composition.clear(true, true)
    this.intervals.resetAll()

    const generatedMelody = this.melody.generate(figures, maxFigures)
    this.drawMelody(generatedMelody)
  }

  // Implementar melodía
  drawMelody (melody) {
    const { width } = this.cameras.main
    const { metrics: { compass, figures: notesPerColumn } } = this.level
    const totalFigures = compass * notesPerColumn
    const figureWidth = 100
    const gapPerNotes = 20

    // Distribuir figuras por compás
    grid({
      totalItems: compass,
      item: { width: (55 + gapPerNotes) * notesPerColumn },
      maxColumns: compass,
      gap: 55,
      position: [width / 2, 570],
      alignCenter: true,
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
          const posX = x + ((55 + gapPerNotes) * j)

          const image = this.add
            .image(posX, y, 'figures', note.name)
            .setOrigin(0.5)

          const aspectRatio = image.height / image.width
          const fixedHeight = figureWidth * aspectRatio
          image.setDisplaySize(figureWidth, fixedHeight)

          if (this.intervals.all.length !== totalFigures) {
            const posInterval = [posX, y + 100]
            this.intervals.draw(posInterval)
          }

          this.composition.add(image)

          // Animation
          this.uiAnimations.slideInFromLeft({
            targets: image,
            duration: 200,
            delay: note.index * 50
          })
          this.uiAnimations.fadeIn({
            targets: this.intervals.all[note.index],
            duration: 300,
            delay: note.index * 55
          })
        }
      }
    })
  }
}
