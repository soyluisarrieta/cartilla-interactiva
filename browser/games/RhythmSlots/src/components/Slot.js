export default class Slot {
  constructor (scene) {
    this.scene = scene
  }

  // Mostrar las casillas para las notas
  drawSlots () {
    const {
      add: scene,
      intervalIndicators,
      config,
      config: { maxSlots },
      screen
    } = this.scene
    const layout = { gap: 30, marginTop: 400, marginRight: 150 }
    const totalBeats = maxSlots / 4 - 1
    const totalWidth = maxSlots * layout.gap + (maxSlots - 1) * 100 + (totalBeats * 50)
    const startX = (screen.width - totalWidth - layout.marginRight) / 2 + layout.gap / 2
    const position = { x: startX, y: layout.marginTop }

    for (let i = 0; i < maxSlots; i++) {
      const slot = scene.image(position.x, position.y, 'slot')
        .setOrigin(0.5)
        .setInteractive()

      const intervalIndicator = scene.image(position.x, position.y + 150, 'uiMainMenu', 'button')
        .setScale(0.2)
        .setOrigin(0.5)

      intervalIndicators.push(intervalIndicator)

      // Separar por compaces de 4
      const isOnTheBeat = (i + 1) % 4
      position.x += layout.gap + (isOnTheBeat ? 100 : 150)

      const slotIndex = config.slots.push({
        element: slot,
        note: null,
        isSelected: false
      }) - 1

      slot.on('pointerdown', () => {
        const selectedSlot = config.slots[slotIndex]
        if (selectedSlot.isSelected) return
        this.selectSlot(selectedSlot)
      })
    }
  }

  // Seleccionar un slot especifico
  selectSlot (slotToSelect) {
    this.scene.config.slots.forEach(slot => {
      slot.element.setScale(0.66)
      slot.isSelected = false
    })

    slotToSelect.element.setScale(0.77)
    slotToSelect.isSelected = true
  }

  // Manejador para la selección de casillas
  handleNoteSelection (btnNote, noteType) {
    const { config } = this.scene
    btnNote.setScale(0.51)

    const selectedSlot = config.slots.find(slot => slot.isSelected)
    if (!selectedSlot || selectedSlot.note === noteType) return

    selectedSlot.note = noteType
    selectedSlot.element.setTexture(noteType)

    const nextEmptySlot = config.slots.find(slot => slot.note === null) || selectedSlot
    this.selectSlot(nextEmptySlot)

    // Mostrar botón de confirmar
    if (!this.scene.filledSlots) {
      const isComplete = config.slots.every(slot => slot.note !== null)

      if (isComplete) {
        this.scene.btnFinish.setTexture('uiMainMenu', 'button-hovered')
        this.scene.filledSlots = true
        return null
      }
    }
  }
}
