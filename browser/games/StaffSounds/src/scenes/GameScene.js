import Alert from '../../../core/components/Alert.js'
import UIManager from '../components/UIManager.js'
import UIAnimations from '../../../core/UIAnimations.js'
import Socket from '../../../core/Socket.js'
import Melody from '../../../core/Melody.js'
import Button from '../../../core/components/Button.js'
import Exercises from '../../../core/components/Exercises.js'
import Health from '../../../core/components/Health.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'
import { GAME_MODES, MUSICAL_STAFF } from '../constants.js'
import { calculateElapsedTime } from '../../../core/utils/calculateElapsedTime.js'
import { getProfile, setProfile } from '../../../../scripts/Profile.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })

    this.ui = new UIManager(this)
    this.alert = new Alert(this)
    this.uiAnimations = new UIAnimations(this)
    this.socket = new Socket(this)
    this.melody = new Melody(this)
    this.exercises = new Exercises(this)
    this.health = new Health(this)

    this.scaleNotes = 0.25
  }

  // Inicialización
  init (level) {
    this.level = level
    this.game = window.gameSettings
    UIManager.title = 'MODO: ' + level.name

    const ALL_NOTES = Object.values(MUSICAL_STAFF[0].NOTES)
    const normalizeName = (name) => name.replace(/'/g, '')

    // Solo notas naturales
    if (level.notes.length < 7) {
      this.notes = ALL_NOTES.filter(({ name }) => !(name.includes('#') || name.includes('b')))
      console.log(this.notes)
      return null
    }

    // Notas con alteraciones en varias octavas
    this.notes = ALL_NOTES.filter(NOTE =>
      level.notes.some((levelNote) => normalizeName(levelNote.name) === normalizeName(NOTE.name))
    )
  }

  // Principal
  create () {
    this.ui.init()
    this.exercises.create(2)
    this.health.draw(5)
    this.start()
    this.exercises.play(0)

    // Botones de acción
    const mode = this.level.mode
    const { LISTEN, READ } = GAME_MODES
    if (mode === LISTEN) this.drawPlayButton()
    if (mode !== READ) this.drawConfirmButton()

    // Iniciar cronometro
    this.levelStartTimer = Date.now()

    // Sonido de inicio de partida
    this.sound.stopAll()
    this.sound.play('startGame')
  }

  // Iniciar ejercicio
  start () {
    const generatedMelody = this.melody.generate(this.level.notes, this.game.maxNotes)
    const mode = this.level.mode
    const { READ, LISTEN } = GAME_MODES

    // Reiniciar pentagrama
    this.pentagram?.forEach((notes) => {
      notes.forEach((note) => {
        note.destroy()
      })
    })

    this.keyNotes?.forEach(label => label.destroy())
    this.keyNotes = []
    this.pentagram = []
    this.composition = new Array(this.game.maxNotes).fill(null)
    this.drawStaffTones()

    // Modo: Leer
    if (mode === READ) {
      this.sequence = []
      this.presetComposition(generatedMelody)
      this.drawKeyNotes(this.level.notes, true)
      return null
    }

    // Modo: Escuchar
    if (mode === LISTEN) {
      const preComposition = generatedMelody.slice(0, 3)
      this.presetComposition(preComposition)
      return null
    }

    // Modo: Escribir
    this.drawKeyNotes(generatedMelody)
    return null
  }

  // Mostrar notas que debe componer
  drawKeyNotes (melody, interactive = false) {
    const { width, height } = this.cameras.main
    const isReadMode = this.level.mode === GAME_MODES.READ
    grid({
      totalItems: melody.length,
      maxColumns: melody.length,
      item: { width: 200 },
      gap: 0,
      position: [width / (isReadMode ? 1.8 : 2.2), height - 60],
      alignCenter: true,
      element: ({ x, y }, i) => {
        const keyNote = this.add
          .bitmapText(x, y, FONTS.PRIMARY, melody[i].name)
          .setOrigin(0.5)

        if (interactive) {
          keyNote.note = melody[i]
          keyNote.setInteractive()
          keyNote.on('pointerup', () => {
            this.sequence.push(keyNote)
            const index = this.sequence.length - 1
            const gotNote = this.sequence[index].note
            const expectedNote = this.composition[index]
            this.checkSecuence(gotNote, expectedNote)
          })
        }

        this.keyNotes.push(keyNote)
        this.uiAnimations.slideInFromBottom({ targets: keyNote, duration: 300, delay: 1000 + i * 100 })
      }
    })
  }

  // Comprobar si está en la secuencia
  checkSecuence (gotNote, expectedNote) {
    // Incorrecto
    if (gotNote.name !== expectedNote.name) {
      this.sequence.pop()
      const totalHealth = this.health.miss()
      const isGameOver = totalHealth === 0

      this.alert.showAlert('¡Nota incorrecta!', {
        type: 'error',
        image: 'gameLogo',
        message: `Vuelve a intentarlo de nuevo. ¡Te quedan ${totalHealth} vidas!`,
        btnAccept: true
      })

      this.sound.play('incorrectMelody')

      if (isGameOver) {
        this.alert.showAlert('¡Fin del juego!', {
          type: 'gameover',
          image: 'gameLogo',
          message: 'Has perdido todas tus vidas, ¡pero puedes volver a intentarlo!',
          btnAccept: false,
          buttons: [
            {
              text: 'Volver a jugar',
              onClick: () => {
                this.scene.start(SCENES.GAME, this.level)
              }
            },
            {
              text: 'Modos',
              onClick: () => {
                this.scene.start(SCENES.LEVEL_SELECTION)
              }
            }
          ],
          dismissible: false
        })

        this.sound.stopAll()
        this.sound.play('gameOver')
      }
      return null
    }

    // Correcto
    const frequency = expectedNote.frequency
    this.melody.playNoteWithFrequency(frequency, 3)
    if (this.sequence.length !== this.composition.length) {
      return null
    }
    const nextExercise = this.exercises.complete()
    if (!nextExercise) {
      this.modeCompleted()
      return null
    }
    this.start()
    this.alert.showAlert('¡Perfecto!', {
      type: 'success',
      image: 'gameLogo',
      message: 'Has completado la secuencia correctamente. ¡Buen trabajo!',
      btnAccept: true
    })

    this.sound.stopAll()
    this.sound.play('perfectMelody')
  }

  // Notas en el Pentagrama
  drawStaffTones () {
    const totalNotes = this.game.maxNotes
    const figureSize = 40
    const gapY = 0
    const gapX = totalNotes < 7 ? 100 : 40

    // Distribuir tonos
    grid({
      totalItems: totalNotes,
      item: { width: figureSize + gapX, height: figureSize },
      maxColumns: totalNotes,
      gap: 60,
      position: [270, 250],
      element: ({ x, y }, i) => {
        this.createTones(x, y, i, figureSize, gapY)
      }
    })
  }

  // Crear los tonos
  createTones (x, y, i, figureSize, gapY) {
    this.notes.forEach((note, index) => {
      const tone = this.add
        .image(x, y + (figureSize + gapY) * index, 'toneDashed')
        .setScale(this.scaleNotes)
        .setInteractive()
        .setAlpha(0)

      tone.name = note.name
      tone.blocked = false
      tone.coords = { x: i, y: index }
      tone.position = note.position
      tone.frequency = note.frequency

      // Agrupar alteración con el tono
      if (tone.name.includes('#') || tone.name.includes('b')) {
        const alterationImageKey = tone.name.includes('#') ? 'sharp' : 'flat'
        tone.alteration = this.add.image(x - 60, y + (figureSize + gapY) * index, alterationImageKey)
          .setScale(this.scaleNotes)
          .setInteractive()
        tone.alteration.setAlpha(0)
      }

      this.createHitBox(x, y, index, figureSize, gapY, tone, i)

      // Guardar todas las posiciones
      if (!this.pentagram[i]) {
        this.pentagram[i] = []
      }
      this.pentagram[i][index] = tone
    })
  }

  // Area de interactividad del tono
  createHitBox (x, y, index, figureSize, gapY, tone, i) {
    const hitBox = this.add
      .rectangle(x, y + (figureSize + gapY) * index, tone.width * this.scaleNotes, tone.height * this.scaleNotes, 0xffffff, 0)
      .setInteractive()

    // Eventos
    hitBox.on('pointerover', () => !tone.blocked && tone.setAlpha(1))
    hitBox.on('pointerout', () => {
      if (tone.blocked) { return }
      if (this.composition[i]?.coords.y !== index) {
        tone.setAlpha(0)
      }
    })
    hitBox.on('pointerup', () => {
      if (!tone.blocked) {
        this.activeTone(i, tone)
      }
    })
  }

  // Manejador para asignar nota
  activeTone (i, tone) {
    if (this.composition[i]) {
      const prevTone = this.composition[i]
      prevTone.setTexture('toneDashed').setAlpha(0)
      if (prevTone.alteration) {
        prevTone.alteration.setAlpha(0)
      }
    }
    this.composition[i] = tone
    tone.setTexture('tone').setAlpha(1)
    if (tone.alteration) {
      tone.alteration.setAlpha(1)
    }

    // Habilitar botón de confirmar
    if (this.level.mode !== GAME_MODES.READ) {
      const isCompositionReady = this.composition.some(note => !note)
      this.disableConfirmButton(isCompositionReady)
    }

    this.uiAnimations.scaleUp({ targets: tone, duration: 300, delay: 0, endScale: this.scaleNotes })
  }

  // Composición preestablecida
  presetComposition (composition) {
    composition.forEach((note, i) => {
      this.pentagram[i].forEach(tone => { tone.blocked = true })
      this.composition[i] = this.pentagram[i][note.position]
    })
    composition.forEach((note, index) => {
      const tone = this.pentagram[index][note.position]
      if (tone) {
        this.time.delayedCall(1200 + index * 200, () => {
          this.activeTone(index, tone)
        })
      }
    })
  }

  // Añadir botón de reproducción
  drawPlayButton () {
    const { width, height } = this.cameras.main
    const [x, y] = [width - 360, height - 170]

    const button = Button.draw(this)({
      ...BUTTONS.LISTEN_MELODY,
      position: [x, y],
      withSound: false,
      onClick: ({ button }) => {
        this.playNotes()
      }
    })

    const label = this.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Reproducir', 32)
      .setOrigin(0.5)
      .setAlpha(0.5)

    this.disablePlayButton = (disable) => {
      button.setDisabled(disable)
      label.setAlpha(disable ? 0.5 : 1)
    }

    this.uiAnimations.slideInFromRight({ targets: button, delay: 400 })
    this.uiAnimations.fadeIn({ targets: label, delay: 800 })
  }

  // Función para reproducir la melodía
  async playNotes (onSound = () => {}) {
    this.disablePlayButton(true)
    const notes = this.melody.current
    const melody = notes.map(({ name, frequency }) => ({
      name,
      frequency,
      duration: 1
    }))
    await this.melody.play(melody, this.game.tempo, onSound)
    this.disablePlayButton(false)
  }

  // Añadir botón de reproducción
  drawConfirmButton () {
    const { width, height } = this.cameras.main
    const [x, y] = [width - 140, height - 170]

    const button = Button.draw(this)({
      ...BUTTONS.PLAY,
      position: [x, y],
      disabled: true,
      withSound: false,
      onClick: async ({ button }) => {
        this.melody.stop()
        const mistakes = this.melody.check(this.composition)

        // Incorrecto
        if (mistakes) {
          const totalHealth = this.health.miss()
          const isGameOver = totalHealth === 0
          const isPlural = mistakes.length > 1 ? 's' : ''
          const alert = {
            title: '¡Composición incorrecta!',
            type: 'error',
            image: 'gameLogo',
            message: `Debes corregir la${isPlural} nota${isPlural}. ¡Te quedan ${totalHealth} vidas!`
          }

          if (isGameOver) {
            alert.title = '¡Fin del juego'
            alert.type = 'default'
            alert.image = 'gameLogo'
            alert.message = 'Has perdido todas tus vidas, ¡pero puedes volver a intentarlo!'

            this.melody.stop()
            this.sound.stopAll()
            this.sound.play('gameOver')
          }

          const buttons = [
            {
              text: 'Volver a jugar',
              onClick: () => {
                this.scene.start(SCENES.GAME, this.level)
              }
            },
            {
              text: 'Modos',
              onClick: () => {
                this.scene.start(SCENES.LEVEL_SELECTION)
              }
            }
          ]

          this.alert.showAlert(alert.title, {
            type: alert.type,
            image: alert.image,
            message: alert.message,
            btnAccept: !isGameOver,
            buttons: isGameOver ? buttons : [],
            dismissible: false
          })

          // Mostar las notas incorrectas
          return
        }

        // Correcto
        const nextExercise = this.exercises.complete()
        if (!nextExercise) {
          this.modeCompleted()
          return null
        }

        this.start()
        this.alert.showAlert('¡Perfecto!', {
          type: 'success',
          image: 'gameLogo',
          message: 'Has avanzado al siguiente ejercicio.',
          btnAccept: true
        })

        // Habilitar botón de confirmar
        if (this.level.mode !== GAME_MODES.READ) {
          const isCompositionReady = this.composition.some(note => !note)
          this.disableConfirmButton(isCompositionReady)
        }
      }
    })

    const label = this.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Confirmar', 32)
      .setOrigin(0.5)
      .setAlpha(0)

    this.disableConfirmButton = (disable) => {
      button.setDisabled(disable)
      label.setAlpha(disable ? 0.5 : 1)
    }

    this.uiAnimations.slideInFromRight({ targets: button, delay: 700, endAlpha: 0.5 })
    this.uiAnimations.fadeIn({ targets: label, duration: 200, delay: 1100, endAlpha: 0.5 })
  }

  // Manejar el modo completado
  modeCompleted () {
    this.sound.stopAll()
    this.sound.play('levelComplete')
    this.alert.showAlert('¡Modo completado!', {
      type: 'success',
      image: 'gameLogo',
      message: 'Puedes seguir practicando este modo o cambiar a otro.',
      dismissible: false,
      buttons: [
        {
          text: 'Volver a jugar',
          onClick: () => {
            this.scene.restart()
          }
        },
        {
          text: 'Modos',
          onClick: () => {
            this.scene.start(SCENES.LEVEL_SELECTION)
          }
        }
      ]
    })

    // Guardar progreso
    const exercises = this.exercises.all.map(({ melody, timer }) => ({ melody, timer }))
    this.socket.levelCompleted({
      level: {
        name: this.level.name,
        totalTimer: calculateElapsedTime(this.levelStartTimer)
      },
      exercises
    })

    const modeIndex = this.level.index
    const profile = getProfile()
    const profileLevel = profile.games[profile.playing].levels[modeIndex]
    profileLevel.completed = true
    setProfile(profile)
  }
}
