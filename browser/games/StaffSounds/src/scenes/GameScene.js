import Alert from '../../../core/components/Alert.js'
import UIManager from '../components/UIManager.js'
import UIAnimations from '../../../core/UIAnimations.js'
import Socket from '../../../core/Socket.js'
import Melody from '../../../core/Melody.js'
import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'
import { GAME_MODES, MUSICAL_STAFF } from '../constants.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })

    this.ui = new UIManager(this)
    this.alert = new Alert(this)
    this.uiAnimations = new UIAnimations(this)
    this.socket = new Socket(this)
    this.melody = new Melody(this)
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
    this.playButton()
    this.confirmButton()
    this.drawTones()
    this.start()

    // Sonido de inicio de partida
    this.sound.stopAll()
    this.sound.play('startGame')
  }

  // Iniciar ejercicio
  start () {
    const generatedMelody = this.melody.generate(this.game.notes, this.game.maxNotes)

    // Modo: Escribir
    if (this.level.mode === GAME_MODES.WRITE) {
      this.drawLabelNotes(generatedMelody)
      return
    }
    // Modo: Escuchar
    if (this.level.mode === GAME_MODES.LISTEN) {
      this.presetComposition(this.game.notes)
    }
    // Modo: Leer
  }

  drawLabelNotes (melody) {
    const { width, height } = this.cameras.main
    grid({
      totalItems: melody.length,
      maxColumns: melody.length,
      item: { width: 200 },
      gap: 0,
      position: [width / 2.2, height - 100],
      alignCenter: true,
      element: ({ x, y }, i) => {
        this.add
          .bitmapText(x, y, FONTS.PRIMARY, melody[i].name)
          .setOrigin(0.5)
      }
    })
  }

  // Notas en el Pentagrama
  drawTones () {
    const clefConfig = MUSICAL_STAFF.find(({ CLEF }) => CLEF === this.game.clef)
    const notesPerColumn = Object.values(clefConfig.NOTES).length
    const totalNotes = this.game.maxNotes
    const figureSize = 50
    const gapY = 0
    const gapX = totalNotes < 7 ? 120 : 40

    // Distribuir tonos
    grid({
      totalItems: totalNotes,
      item: { width: figureSize + gapX, height: figureSize },
      maxColumns: totalNotes,
      gap: figureSize,
      position: [300, 250],
      element: ({ x, y }, i) => {
        this.createTones(x, y, i, notesPerColumn, figureSize, gapY, clefConfig)
      }
    })
  }

  // Crear los tonos
  createTones (x, y, i, notesPerColumn, figureSize, gapY, clefConfig) {
    for (let index = 0; index < notesPerColumn; index++) {
      const tone = this.add
        .image(x, y + (figureSize + gapY) * index, 'toneDashed')
        .setScale(0.3)
        .setInteractive()
        .setAlpha(0)

      tone.coords = { x: i, y: index }

      // Asignar nota correspondiente según la posición
      const note = Object.values(clefConfig.NOTES).find(n => n.position === index)
      if (note) {
        tone.name = note.name
        tone.position = note.position
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

  // Composición preestablecida
  presetComposition (notes) {
    notes.forEach((note, index) => {
      const tone = this.pentagram[index][note.position]
      if (tone) {
        this.handleOnClick(index, tone)
      }
    })
  }

  // Añadir botón de reproducción
  playButton () {
    const { width, height } = this.cameras.main
    const [x, y] = [width - 360, height - 170]

    Button.draw(this)({
      ...BUTTONS.LISTEN_MELODY,
      position: [x, y],
      withSound: false,
      onClick: ({ button }) => {
        this.playComposition(this.game.notes)
      }
    })

    this.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Reproducir', 32)
      .setOrigin(0.5)
  }

  // Función para reproducir la melodía
  async playComposition (onSound = () => {}) {
    const melody = this.composition.map(({ name, frequency }) => ({
      name,
      frequency,
      duration: 1
    }))
    await this.melody.play(melody, this.game.tempo, onSound)
  }

  // Añadir botón de reproducción
  confirmButton () {
    const { width, height } = this.cameras.main
    const [x, y] = [width - 140, height - 170]

    Button.draw(this)({
      ...BUTTONS.PLAY,
      position: [x, y],
      withSound: false,
      onClick: async ({ button }) => {
        const mistakes = this.melody.check(this.composition)

        // Incorrecto
        if (mistakes) {
          this.alert.showAlert('¡Melodía incorrecta!', {
            type: 'error',
            image: 'gameLogo',
            message: 'Debes corregir las notas. Has perdido una de tus vidas',
            btnAccept: true
          })

          return
        }

        // Correcto
        this.alert.showAlert('¡Perfecto!', {
          type: 'success',
          image: 'gameLogo',
          message: 'Has avanzado al siguiente ejercicio.',
          btnAccept: true
        })
      }
    })

    this.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Confirmar', 32)
      .setOrigin(0.5)
  }
}
