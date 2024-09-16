import { addInteractions } from '/scripts/Utils.js'

const TEMPO = 1000 // ms

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
    this.btnPlayMelody = null
    this.melodyState = {
      isPlaying: false,
      timers: []
    }
    this.currentExercise = null
    this.settings = window.gameSettings
    this.textureStates = {
      playing: 'button',
      failed: 'button-pressed',
      completed: 'button-hovered'
    }
    this.figureDurations = {
      crotchet: 1,
      crotchetRest: 1
    }
  }

  // Método inicial
  init (selectedLevel) {
    this.selectedLevel = selectedLevel ?? 1
    this.screen = this.cameras.main

    this.config = {
      slots: [],
      exercises: [],
      ...this.settings.levels[selectedLevel - 1]
    }

    // Generar la melodía aleatoria aquí
    this.generatedMelody = this.generateMelody()
  }

  // Método principal
  create () {
    this.drawBackButton()
    this.drawLevelInfo()
    this.drawSlots()
    this.drawNoteButtons()
    this.drawExercises(7)
    this.drawActionButtons()
    this.selectSlot(this.config.slots[0])
  }

  // Crear botón para regresar a la selección de niveles
  drawBackButton () {
    const backButton = this.add.image(100, 100, 'uiLvlSelection', 'btn-arrow')
      .setScale(1.5)
      .setOrigin(0.5)
      .setInteractive()

    backButton.flipX = true

    addInteractions({
      button: backButton,
      key: 'uiLvlSelection',
      frame: 'btn-arrow',
      onClick: () => {
        this.scene.start('LevelSelectionScene', {
          levels: this.settings.levels
        })
      }
    })
  }

  // Mostrar la información del nivel actual
  drawLevelInfo () {
    this.add.bitmapText(this.screen.width / 2, 100, 'primaryFont', `Jugando en el nivel #${this.selectedLevel}`)
      .setOrigin(0.5, 0)
  }

  // Mostrar las casillas para las notas
  drawSlots () {
    const layout = { gap: 30, marginTop: 400, marginRight: 150 }
    const { maxSlots } = this.config
    const totalBeats = maxSlots / 4 - 1
    const totalWidth = maxSlots * layout.gap + (maxSlots - 1) * 100 + (totalBeats * 50)
    const startX = (this.screen.width - totalWidth - layout.marginRight) / 2 + layout.gap / 2
    const position = { x: startX, y: layout.marginTop }

    for (let i = 0; i < maxSlots; i++) {
      const slot = this.add.image(position.x, position.y, 'slot')
        .setOrigin(0.5)
        .setInteractive()

      // Separar por compaces de 4
      const isOnTheBeat = (i + 1) % 4
      position.x += layout.gap + (isOnTheBeat ? 100 : 150)

      const slotIndex = this.config.slots.push({
        element: slot,
        note: null,
        isSelected: false
      }) - 1

      slot.on('pointerdown', () => {
        const selectedSlot = this.config.slots[slotIndex]
        if (selectedSlot.isSelected) return
        this.selectSlot(selectedSlot)
      })
    }
  }

  // Generar una melodía aleatoria
  generateMelody () {
    const { maxSlots, figures } = this.config
    const melody = []
    for (let i = 0; i < maxSlots; i++) {
      const randomFigure = figures[Math.floor(Math.random() * figures.length)]
      melody.push(randomFigure)
    }
    return melody
  }

  // Mostrar los botones para seleccionar notas
  drawNoteButtons () {
    const layout = { gap: 10, marginTop: 700, marginRight: 150 }
    const { figures } = this.config
    const totalWidth = figures.length * layout.gap + (figures.length - 1) * 100
    const startX = (this.screen.width - totalWidth - layout.marginRight) / 2 + layout.gap / 2
    const position = { x: startX, y: layout.marginTop }

    figures.forEach((note, index) => {
      const btnNote = this.add.image(position.x, position.y, note)
        .setScale(0.56)
        .setOrigin(0.5)
        .setInteractive()

      position.x += layout.gap + 100

      btnNote.on('pointerdown', () => this.handleNoteSelection(btnNote, note, index))
      btnNote.on('pointerup', () => btnNote.setScale(0.56))
      btnNote.on('pointerout', () => btnNote.setScale(0.56))
    })
  }

  // Mostrar los ejercicios
  drawExercises (numExercises) {
    for (let i = 0; i <= numExercises; i++) {
      const layout = { marginTop: 150, gap: 80 }
      const positionX = this.screen.width - 100
      const positionY = layout.marginTop + (layout.gap * (i + 1))
      const exerciseElement = this.add.image(positionX, positionY, 'uiMainMenu', 'button-pressed')
        .setScale(0.5)
        .setOrigin(0.5)
        .setInteractive()

      const generatedMelody = this.generateMelody()

      this.config.exercises.push({
        element: exerciseElement,
        state: null,
        melody: generatedMelody,
        setState: (state) => {
          this.config.exercises[i].state = state
          exerciseElement.setTexture('uiMainMenu', this.textureStates[state])
        }
      })
    }

    // Activar el primer ejercicio
    this.currentExercise = this.config.exercises[0]
    this.currentExercise.setState('playing')
  }

  // Mostrar los botones de acción
  drawActionButtons () {
    // Botón para repetir la melodía generada
    const btnPlayMelody = this.btnPlayMelody = this.add
      .image(this.screen.width - 300, this.screen.height - 130, 'uiMainMenu', 'button')
      .setScale(0.7)
      .setOrigin(0.5)
      .setInteractive()

    this.add.bitmapText(this.screen.width - 300, this.screen.height - 70, 'primaryFont', 'Melodía', 24)
      .setOrigin(0.5, 0)

    // Toggle button
    btnPlayMelody.on('pointerdown', () => {
      btnPlayMelody.setScale(0.66)
      if (this.melodyState.isPlaying) {
        this.stopMelody()
        btnPlayMelody.setTexture('uiMainMenu', 'button')
      } else {
        this.playMelody(this.currentExercise.melody)
        btnPlayMelody.setTexture('uiMainMenu', 'button-pressed')
      }
    })
    btnPlayMelody.on('pointerup', () => btnPlayMelody.setScale(0.7))
    btnPlayMelody.on('pointerout', () => btnPlayMelody.setScale(0.7))

    // Botón para verificar la melodía compuesta
    const btnFinish = this.add.image(this.screen.width - 130, this.screen.height - 130, 'uiMainMenu', 'button')
      .setScale(0.7)
      .setOrigin(0.5)
      .setInteractive()

    this.add.bitmapText(this.screen.width - 130, this.screen.height - 70, 'primaryFont', 'Siguiente', 24)
      .setOrigin(0.5, 0)

    btnFinish.on('pointerdown', () => {
      btnFinish.setScale(0.66)
      this.checkMelody() // Llamada para comprobar la melodía
    })
    btnFinish.on('pointerup', () => btnFinish.setScale(0.7))
    btnFinish.on('pointerout', () => btnFinish.setScale(0.7))
  }

  // Reproducir la melodía generada
  playMelody (melody) {
    this.melodyState.isPlaying = true
    this.melodyState.timers = []
    let timeElapsed = 0

    melody.forEach((figure, i) => {
      const duration = this.figureDurations[figure]
      const timer = this.time.delayedCall(timeElapsed, () => {
        if (figure !== 'crotchetRest') {
          this.sound.play('noteSound')
        }

        // Establecer en false solo después de la última figura
        if (i === melody.length - 1) {
          this.melodyState.isPlaying = false
          this.btnPlayMelody.setScale(0.7)
          this.btnPlayMelody.setTexture('uiMainMenu', 'button')
        }
      })

      // Guardar cada timer
      this.melodyState.timers.push(timer)
      timeElapsed += duration * TEMPO
    })
  }

  // Detener la reproducción de la melodía
  stopMelody () {
    this.melodyState.isPlaying = false

    // Cancelar todos los delayedCalls pendientes
    this.melodyState.timers.forEach(timer => timer.remove(false))
    this.melodyState.timers = []
  }

  // Verificar si la melodía compuesta es correcta
  checkMelody () {
    const userMelody = this.config.slots.map(slot => slot.note)

    // Melodía incompleta
    if (userMelody.includes(null)) {
      console.log('Debes componer toda la melodía antes de comprobarla')
      return null
    }

    // Comprobar melodía
    const mistakes = []
    userMelody.forEach((note, i) => {
      if (note !== this.currentExercise.melody[i]) {
        mistakes.push({ slot: i, expected: this.currentExercise.melody[i], got: note })
      }
    })

    // Melodía incorrecta
    if (mistakes.length > 0) {
      this.advanceToNextExercise('failed')
      return null
    }

    // Melodía correcta
    this.advanceToNextExercise('completed')
  }

  // Avanzar al siguiente ejercicio
  advanceToNextExercise (exerciseState) {
    this.currentExercise.setState(exerciseState)

    // Encontrar el siguiente ejercicio
    const nextExerciseIndex = this.config.exercises.indexOf(this.currentExercise) + 1
    if (nextExerciseIndex < this.config.exercises.length) {
      this.currentExercise = this.config.exercises[nextExerciseIndex]
      this.currentExercise.setState('playing')
      this.generatedMelody = this.currentExercise.melody

      // Limpiar las notas en las casillas
      this.config.slots.forEach(slot => {
        slot.note = null
        slot.element.setTexture('slot')
      })
      this.selectSlot(this.config.slots[0])
    } else {
      console.log('¡Nivel completado!')
    }
  }

  // Seleccionar un slot especifico
  selectSlot (slotToSelect) {
    this.config.slots.forEach(slot => {
      slot.element.setScale(0.66)
      slot.isSelected = false
    })

    slotToSelect.element.setScale(0.77)
    slotToSelect.isSelected = true
  }

  // Manejador para la selección de casillas
  handleNoteSelection (btnNote, noteType) {
    btnNote.setScale(0.51)

    const selectedSlot = this.config.slots.find(slot => slot.isSelected)
    if (!selectedSlot || selectedSlot.note === noteType) return

    selectedSlot.note = noteType
    selectedSlot.element.setTexture(noteType)

    const nextEmptySlot = this.config.slots.find(slot => slot.note === null) || selectedSlot
    this.selectSlot(nextEmptySlot)
  }
}

export default GameScene
