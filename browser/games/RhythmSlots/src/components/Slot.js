export default class Slot {
  constructor (scene) {
    this.scene = scene
    this.filledSlots = false
    this.intervalIndicators = []
    this.invervalTextures = {
      normal: 'interval-off',
      actived: 'interval-on'
    }
  }

  // Mostrar las casillas para las notas
  drawSlots () {
    const {
      add: scene,
      slots,
      screen
    } = this.scene
    const { maxSlots, compass } = this.scene.level

    const layout = { gap: 30, marginTop: 400, marginRight: 150 }
    const totalBeats = maxSlots / 4 - 1
    const totalWidth = maxSlots * layout.gap + (maxSlots - 1) * 100 + (totalBeats * 50)
    const startX = (screen.width - totalWidth - layout.marginRight) / 2 + layout.gap / 2
    const position = { x: startX, y: layout.marginTop }

    const banner = maxSlots === 4 ? 'itemBanner1' : maxSlots === 8 ? 'itemBanner2' : 'itemBanner3'

    this.scene.add
      .image(screen.width / 2 - layout.marginRight / 2, position.y + 50, banner)

    for (let i = 0; i < maxSlots; i++) {
      const slot = scene.image(position.x, position.y, 'slot')
        .setOrigin(0.5)
        .setInteractive()

      const intervalIndicator = scene.image(position.x, position.y + 140, 'intervalIndicator', this.invervalTextures.normal)
        .setOrigin(0.5)

      this.intervalIndicators.push(intervalIndicator)

      // Separar por compaces
      const isOnTheBeat = (i + 1) % compass
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

      this.scene.uiAnimations.fadeIn({
        targets: [slot, intervalIndicator],
        duration: 200,
        delay: i * 100
      })
    }
  }

  // Cambiar estado del intervalo
  changeIntervalStatus (interval, state) {
    return interval
      .setTexture('intervalIndicator', state)
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
      slot.element.setScale(0.7)
      slot.isSelected = false
      slot.element.clearTint()
    })

    slotToSelect.element.setScale(0.8)
    slotToSelect.isSelected = true
    slotToSelect.element.setTint(0xFFD700)
  }

  // Manejador para la selección de casillas
  handleNoteSelection (figure) {
    const slots = this.scene.slots

    const indexSelectedSlot = slots.findIndex(slot => slot.isSelected)
    const selectedSlot = slots[indexSelectedSlot]
    if (!selectedSlot || selectedSlot.note === figure.name) return

    // Reiniciar textura del intervalo
    const interval = this.intervalIndicators[indexSelectedSlot]
    this.changeIntervalStatus(interval, this.invervalTextures.normal)

    selectedSlot.figure = figure
    selectedSlot.note = figure.name
    selectedSlot.element.setTexture('pieces', `piece-${figure.name}`)
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
