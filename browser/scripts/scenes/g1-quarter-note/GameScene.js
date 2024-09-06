import { addInteractions } from '/scripts/Utils.js'

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameScene' })
    this.levelSelected = 1
    this.settings = window.gameSettings
    this.config = {
      slots: [],
      totalSlots: 4,
      notes: ['crotchet', 'crotchet-rest']
    }
  }

  init (levelSelected) {
    this.levelSelected = levelSelected
    this.screen = this.cameras.main
  }

  create () {
    // Botón de ir atrás
    const btnBack = this.add.image(100, 100, 'uiLvlSelection', 'btn-arrow')
      .setScale(1.5)
      .setOrigin(0.5)
      .setInteractive()

    btnBack.flipX = true

    addInteractions({
      button: btnBack,
      key: 'uiLvlSelection',
      frame: 'btn-arrow',
      onClick: () => {
        this.scene.start('LevelSelectionScene', {
          levels: this.settings.levels
        })
      }
    })

    // Crear el contenido del juego aquí
    this.add.bitmapText(this.screen.width / 2, 100, 'primaryFont', `Jugando en el nivel #${this.levelSelected}`)
      .setOrigin(0.5, 0)

    // UI
    this.drawSlots()
    this.drawBtnNotes()

    // Autoseleccionar la primer casilla para iniciar
    this.selectSlot(this.config.slots[0])
  }

  // Dibujar casillas de notas
  drawSlots () {
    const style = { gap: 120, marginTop: 400 }
    const totalSlots = this.config.totalSlots
    const totalWidth = totalSlots * style.gap + (totalSlots - 1) * 100
    const startX = (this.screen.width - totalWidth) / 2 + style.gap / 2
    const position = { x: startX, y: style.marginTop }

    for (let i = 0; i < totalSlots; i++) {
      const slot = this.add.image(position.x, position.y, 'slot')
        .setOrigin(0.5, 0.5)
        .setInteractive()

      position.x += style.gap + 100

      // Propiedades de slot
      const indexItem = this.config.slots.push({
        element: slot,
        note: null,
        isSelected: false
      }) - 1

      // Selección de slot
      slot.on('pointerdown', () => {
        const slotSelected = this.config.slots[indexItem]
        if (slotSelected.isSelected) { return null }
        this.selectSlot(slotSelected)
      })
    }
  }

  selectSlot (slotSelected) {
    this.config.slots.forEach(slot => {
      slot.element.setScale(1)
      slot.isSelected = false
    })

    slotSelected.element.setScale(1.2)
    slotSelected.isSelected = true
  }

  // Dibutar botones de notas
  drawBtnNotes () {
    const style = { gap: 70, marginTop: 800 }
    const totalButtons = this.config.notes.length
    const totalWidth = totalButtons * style.gap + (totalButtons - 1) * 100
    const startX = (this.screen.width - totalWidth) / 2 + style.gap / 2
    const position = { x: startX, y: style.marginTop }

    for (let i = 0; i < totalButtons; i++) {
      const btnFigure = this.add.image(position.x, position.y, this.config.notes[i])
        .setScale(0.7)
        .setOrigin(0.5, 0.5)
        .setInteractive()

      position.x += style.gap + 100

      // Establecer nota en la casilla
      btnFigure.on('pointerup', () => {
        btnFigure.setScale(0.7)
        const slotSelected = this.config.slots.find((slot) => slot.isSelected)
        if (this.config.notes[i] === slotSelected.note) { return null }

        slotSelected.note = this.config.notes[i]
        slotSelected.element
          .setTexture(this.config.notes[i])

        // Autoseleccionar siguiente casilla vacía
        const nextSlot = this.config.slots.find((slot) => slot.note === null) ?? slotSelected
        this.selectSlot(nextSlot)
      })

      // Interacción de botón presionado
      btnFigure.on('pointerdown', () => btnFigure.setScale(0.6))
      btnFigure.on('pointerout', () => btnFigure.setScale(0.7))
    }
  }
}

export default GameScene
