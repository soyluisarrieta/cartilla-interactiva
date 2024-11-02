export default class Slot {
  constructor (scene) {
    this.scene = scene
    this.filledSlots = false
    this.intervalIndicators = []
    this.invervalTextures = {
      normal: 'home',
      actived: 'listen-melody'
    }
  }

  // Mostrar las casillas para las notas
  drawSlots () {
    const {
      add: scene,
      slots,
      screen
    } = this.scene
    const { maxSlots } = this.scene.level

    const layout = { gap: 30, marginTop: 400, marginRight: 150 }
    const totalBeats = maxSlots / 4 - 1
    const totalWidth = maxSlots * layout.gap + (maxSlots - 1) * 100 + (totalBeats * 50)
    const startX = (screen.width - totalWidth - layout.marginRight) / 2 + layout.gap / 2
    const position = { x: startX, y: layout.marginTop }

    for (let i = 0; i < maxSlots; i++) {
      const slot = scene.image(position.x, position.y, 'slot')
        .setOrigin(0.5)
        .setInteractive()

      const intervalIndicator = scene.image(position.x, position.y + 160, 'uiButtons', this.invervalTextures.normal)
        .setScale(0.4)
        .setOrigin(0.5)

      this.intervalIndicators.push(intervalIndicator)

      // Separar por compaces de 4
      const isOnTheBeat = (i + 1) % 4
      position.x += layout.gap + (isOnTheBeat ? 100 : 150)

      const slotIndex = slots.push({
        element: slot,
        note: null,
        isSelected: false,
        isFixed: true
      }) - 1

      slot.on('pointerdown', () => {
        const selectedSlot = slots[slotIndex]
        if (selectedSlot.isSelected) return
        this.selectSlot(selectedSlot)
      })

      this.scene.animations.fadeIn({
        targets: [slot, intervalIndicator],
        duration: 200,
        delay: i * 100
      })
    }
  }

  // Cambiar estado del intervalo
  changeIntervalStatus (interval, state) {
    return interval
      .setTexture('uiButtons', state)
      .setScale(0.4)
  }

  // Reiniciar texturas
  resetIntervals () {
    this.intervalIndicators.forEach(interval => {
      this.changeIntervalStatus(interval, this.invervalTextures.normal)
    })
  }

  // Seleccionar un slot especifico
  selectSlot (slotToSelect) {
    this.scene.slots.forEach(slot => {
      slot.element.setScale(0.66)
      slot.isSelected = false
    })

    slotToSelect.element.setScale(0.77)
    slotToSelect.isSelected = true
  }

  // Manejador para la selección de casillas
  handleNoteSelection (btnNote, figure) {
    const slots = this.scene.slots
    btnNote.setScale(0.51)

    const indexSelectedSlot = slots.findIndex(slot => slot.isSelected)
    const selectedSlot = slots[indexSelectedSlot]
    if (!selectedSlot || selectedSlot.note === figure.name) return

    // Reiniciar textura del intervalo
    const interval = this.intervalIndicators[indexSelectedSlot]
    this.changeIntervalStatus(interval, this.invervalTextures.normal)

    selectedSlot.figure = figure
    selectedSlot.note = figure.name
    selectedSlot.element.setTexture(figure.name)
    selectedSlot.isFixed = true

    const nextEmptySlot = slots.find(slot => slot.note === null || !slot.isFixed)
    this.selectSlot(nextEmptySlot || selectedSlot)

    // Mostrar botón de confirmar
    if (!this.filledSlots) {
      const isComplete = slots.every(slot => slot.note !== null && slot.isFixed === true)
      if (isComplete) {
        this.filledSlots = true
        this.scene.ui.disableFinishButton(false)
      }
    }
  }
}
