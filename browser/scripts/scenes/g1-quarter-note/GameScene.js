import { addInteractions } from '/scripts/Utils.js'

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
    this.selectedLevel = 1
    this.settings = window.gameSettings
    this.config = {
      slots: [],
      maxSlots: 4,
      noteTypes: ['crotchet', 'crotchet-rest']
    }
  }

  init (selectedLevel) {
    this.selectedLevel = selectedLevel
    this.screen = this.cameras.main
  }

  create () {
    this.createBackButton()
    this.displayLevelInfo()
    this.renderSlots()
    this.renderNoteButtons()
    this.selectSlot(this.config.slots[0])
  }

  // Crear botón para regresar a la selección de niveles
  createBackButton () {
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
  displayLevelInfo () {
    this.add.bitmapText(this.screen.width / 2, 100, 'primaryFont', `Jugando en el nivel #${this.selectedLevel}`)
      .setOrigin(0.5, 0)
  }

  // Renderizar los espacios para las notas
  renderSlots () {
    const layout = { gap: 120, marginTop: 400 }
    const { maxSlots } = this.config
    const totalWidth = maxSlots * layout.gap + (maxSlots - 1) * 100
    const startX = (this.screen.width - totalWidth) / 2 + layout.gap / 2
    const position = { x: startX, y: layout.marginTop }

    for (let i = 0; i < maxSlots; i++) {
      const slot = this.add.image(position.x, position.y, 'slot')
        .setOrigin(0.5)
        .setInteractive()

      position.x += layout.gap + 100

      const slotIndex = this.config.slots.push({
        element: slot,
        note: null,
        isSelected: false
      }) - 1

      slot.on('pointerdown', () => this.handleSlotSelection(slotIndex))
    }
  }

  handleSlotSelection (slotIndex) {
    const selectedSlot = this.config.slots[slotIndex]
    if (selectedSlot.isSelected) return
    this.selectSlot(selectedSlot)
  }

  selectSlot (slotToSelect) {
    this.config.slots.forEach(slot => {
      slot.element.setScale(1)
      slot.isSelected = false
    })

    slotToSelect.element.setScale(1.2)
    slotToSelect.isSelected = true
  }

  // Renderizar los botones para seleccionar notas
  renderNoteButtons () {
    const layout = { gap: 70, marginTop: 800 }
    const { noteTypes } = this.config
    const totalWidth = noteTypes.length * layout.gap + (noteTypes.length - 1) * 100
    const startX = (this.screen.width - totalWidth) / 2 + layout.gap / 2
    const position = { x: startX, y: layout.marginTop }

    noteTypes.forEach((note, index) => {
      const noteButton = this.add.image(position.x, position.y, note)
        .setScale(0.7)
        .setOrigin(0.5)
        .setInteractive()

      position.x += layout.gap + 100

      noteButton.on('pointerdown', () => this.handleNoteSelection(noteButton, note, index))
      noteButton.on('pointerup', () => noteButton.setScale(0.7))
      noteButton.on('pointerout', () => noteButton.setScale(0.7))
    })
  }

  handleNoteSelection (noteButton, noteType) {
    noteButton.setScale(0.6)

    const selectedSlot = this.config.slots.find(slot => slot.isSelected)
    if (!selectedSlot || selectedSlot.note === noteType) return

    selectedSlot.note = noteType
    selectedSlot.element.setTexture(noteType)

    const nextEmptySlot = this.config.slots.find(slot => slot.note === null) || selectedSlot
    this.selectSlot(nextEmptySlot)
  }
}

export default GameScene
