import { addInteractions } from '/scripts/Utils.js'

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
    this.settings = window.gameSettings
    this.textureStates = {
      playing: 'button',
      failed: 'button-pressed',
      completed: 'button-hovered'
    }
  }

  init (selectedLevel) {
    this.selectedLevel = selectedLevel ?? 1
    this.screen = this.cameras.main

    this.config = {
      slots: [],
      exercises: [],
      ...this.settings.levels[selectedLevel - 1]
    }
  }

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

      this.config.exercises.push({
        element: exerciseElement,
        state: null,
        setState: (state) => {
          this.config.exercises[i].state = state
          exerciseElement.setTexture('uiMainMenu', this.textureStates[state])
        }
      })
    }

    // Activar el primer ejercicio
    this.config.exercises[0].setState('playing')
  }

  // Mostrar los botones de acción
  drawActionButtons () {
    // Botón para repetir la melodía generada
    const btnRepeatMelody = this.add.image(this.screen.width - 300, this.screen.height - 130, 'uiMainMenu', 'button')
      .setScale(0.7)
      .setOrigin(0.5)
      .setInteractive()

    this.add.bitmapText(this.screen.width - 300, this.screen.height - 70, 'primaryFont', 'Melodía', 24)
      .setOrigin(0.5, 0)

    btnRepeatMelody.on('pointerdown', () => {
      btnRepeatMelody.setScale(0.66)
      console.log('pressed')
    })
    btnRepeatMelody.on('pointerup', () => btnRepeatMelody.setScale(0.7))
    btnRepeatMelody.on('pointerout', () => btnRepeatMelody.setScale(0.7))

    // Botón para verificar la melodía compuesta
    const btnFinish = this.add.image(this.screen.width - 130, this.screen.height - 130, 'uiMainMenu', 'button')
      .setScale(0.7)
      .setOrigin(0.5)
      .setInteractive()

    this.add.bitmapText(this.screen.width - 130, this.screen.height - 70, 'primaryFont', 'Siguiente', 24)
      .setOrigin(0.5, 0)

    btnFinish.on('pointerdown', () => {
      btnFinish.setScale(0.66)
      console.log('pressed')
    })
    btnFinish.on('pointerup', () => btnFinish.setScale(0.7))
    btnFinish.on('pointerout', () => btnFinish.setScale(0.7))
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
