import Alert from '../../../core/components/Alert.js'
import UIManager from '../components/UIManager.js'
import UIAnimations from '../../../core/UIAnimations.js'
import Socket from '../../../core/Socket.js'
import { SCENES } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })

    this.ui = new UIManager(this)
    this.alert = new Alert(this)
    this.uiAnimations = new UIAnimations(this)
    this.socket = new Socket(this)
  }

  // Inicialización
  init (level) {
    this.level = level
    this.game = window.gameSettings
  }

  // Principal
  create () {
    this.ui.init()
    this.start()
    this.drawNotes()

    // Sonido de inicio de partida
    this.sound.stopAll()
    this.sound.play('startGame')
  }

  // Iniciar ejercicio
  start () {

  }

  // Notas en el Pentagrama
  drawNotes () {
    const figureSize = 50
    const gapY = 0
    const gapX = 40
    const notesPerColumn = 10
    const totalColumns = 10

    // Distribuir tonos
    grid({
      totalItems: totalColumns,
      item: { width: figureSize + gapX, height: figureSize },
      maxColumns: totalColumns,
      gap: figureSize,
      position: [300, 250],
      element: ({ x, y }, i) => {
        // Crear figuras de los tonos
        for (let index = 0; index < notesPerColumn; index++) {
          const tone = this.add
            .image(x, y + (figureSize + gapY) * index, 'toneDashed')
            .setScale(0.3)
            .setInteractive()
            .setAlpha(0)

          tone.columnIndex = i

          // Zona interactiva
          const hitBox = this.add
            .rectangle(x, y + (figureSize + gapY) * index, tone.width * 0.3, tone.height * 0.3, 0xffffff, 0)
            .setInteractive()

          // Mostrar que se puede presionar
          hitBox.on('pointerover', () => {
            tone.setAlpha(1)
          })

          // Ocultar el presionable
          hitBox.on('pointerout', () => {
            tone.setAlpha(0)
          })

          // Fijar nota en la ubicación cliqueada
          hitBox.on('pointerup', () => {
            tone
              .setTexture('tone')
              .setAlpha(1)
          })
        }
      }
    })
  }
}
