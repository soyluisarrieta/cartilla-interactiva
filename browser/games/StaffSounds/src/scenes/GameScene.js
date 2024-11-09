import Alert from '../../../core/components/Alert.js'
import UIManager from '../components/UIManager.js'
import UIAnimations from '../../../core/UIAnimations.js'
import Socket from '../../../core/Socket.js'
import { SCENES } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'
import { MUSICAL_STAFF } from '../constants.js'

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
    this.composition = []
    this.pentagram = []
  }

  // Principal
  create () {
    this.ui.init()
    this.drawTones()
    this.start()

    // Sonido de inicio de partida
    this.sound.stopAll()
    this.sound.play('startGame')
  }

  // Iniciar ejercicio
  start () {
    // Implementación del método start
  }

  // Notas en el Pentagrama
  drawTones () {
    const trebleClefConfig = MUSICAL_STAFF.find(({ CLEF }) => CLEF === this.level.clef)
    const notesPerColumn = Object.values(trebleClefConfig.NOTES).length
    const totalNotes = this.level.notes.length
    const figureSize = 50
    const gapY = 0
    const gapX = totalNotes < 5 ? 100 : 40

    // Distribuir tonos
    grid({
      totalItems: totalNotes,
      item: { width: figureSize + gapX, height: figureSize },
      maxColumns: totalNotes,
      gap: figureSize,
      position: [300, 250],
      element: ({ x, y }, i) => {
        this.createTones(x, y, i, notesPerColumn, figureSize, gapY, trebleClefConfig)
      }
    })
  }

  // Crear los tonos
  createTones (x, y, i, notesPerColumn, figureSize, gapY, trebleClefConfig) {
    for (let index = 0; index < notesPerColumn; index++) {
      const tone = this.add
        .image(x, y + (figureSize + gapY) * index, 'toneDashed')
        .setScale(0.3)
        .setInteractive()
        .setAlpha(0)

      tone.coords = { x: i, y: index }

      // Asignar nota correspondiente según la posición
      const note = Object.values(trebleClefConfig.NOTES).find(n => n.position === index)
      if (note) {
        tone.name = note.name
        tone.frequency = note.frequency
      }

      this.createHitBox(x, y, index, figureSize, gapY, tone, i)

      // Guardar todas las posiciones
      if (!this.pentagram[i]) {
        this.pentagram[i] = []
      }
      this.pentagram[i][index] = tone
    }
  }

  // Area de interactividad del tono
  createHitBox (x, y, index, figureSize, gapY, tone, i) {
    const hitBox = this.add
      .rectangle(x, y + (figureSize + gapY) * index, tone.width * 0.3, tone.height * 0.3, 0xffffff, 0)
      .setInteractive()

    // Eventos
    hitBox.on('pointerover', () => tone.setAlpha(1))
    hitBox.on('pointerout', () => {
      if (this.composition[i]?.coords.y !== index) {
        tone.setAlpha(0)
      }
    })
    hitBox.on('pointerup', () => this.handleOnClick(i, tone))
  }

  // Manejador para asignar nota
  handleOnClick (i, tone) {
    if (this.composition[i]) {
      const prevTone = this.composition[i]
      prevTone
        .setTexture('toneDashed')
        .setAlpha(0)
    }
    this.composition[i] = tone
    tone
      .setTexture('tone')
      .setAlpha(1)
  }
}
