import { addInteractions } from '../../../utils/addInteractions.js'

export default class UIManager {
  constructor (scene) {
    this.scene = scene
  }

  // Crear botón para regresar a la selección de niveles
  drawBackButton () {
    const backButton = this.scene.add.image(100, 100, 'uiLvlSelection', 'btn-arrow')
      .setScale(1.5)
      .setOrigin(0.5)
      .setInteractive()

    backButton.flipX = true

    addInteractions({
      button: backButton,
      key: 'uiLvlSelection',
      frame: 'btn-arrow',
      onClick: () => {
        this.scene.scene.start('LevelSelectionScene', {
          levels: this.scene.settings.levels
        })
      }
    })
  }

  // Mostrar la información del nivel actual
  drawLevelInfo () {
    this.scene.add.bitmapText(this.scene.screen.width / 2, 100, 'primaryFont', `Jugando en el nivel #${this.scene.selectedLevel}`)
      .setOrigin(0.5, 0)
  }

  // Mostrar los botones para seleccionar notas
  drawNoteButtons () {
    const layout = { gap: 10, marginTop: 700, marginRight: 150 }
    const { figures } = this.scene.config
    const totalWidth = figures.length * layout.gap + (figures.length - 1) * 100
    const startX = (this.scene.screen.width - totalWidth - layout.marginRight) / 2 + layout.gap / 2
    const position = { x: startX, y: layout.marginTop }

    figures.forEach((figure, index) => {
      const btnNote = this.scene.add.image(position.x, position.y, figure.name)
        .setScale(0.56)
        .setOrigin(0.5)
        .setInteractive()

      position.x += layout.gap + 100

      btnNote.on('pointerdown', () => this.scene.slot.handleNoteSelection(btnNote, figure.name, index))
      btnNote.on('pointerup', () => btnNote.setScale(0.56))
      btnNote.on('pointerout', () => btnNote.setScale(0.56))
    })
  }

  // Mostrar los ejercicios
  drawExercises (numExercises) {
    for (let i = 0; i <= numExercises; i++) {
      const layout = { marginTop: 150, gap: 80 }
      const positionX = this.scene.screen.width - 100
      const positionY = layout.marginTop + (layout.gap * (i + 1))
      const exerciseElement = this.scene.add.image(positionX, positionY, 'uiMainMenu', 'button-pressed')
        .setScale(0.5)
        .setOrigin(0.5)
        .setInteractive()

      const generatedMelody = this.scene.melody.generate()

      this.scene.config.exercises.push({
        element: exerciseElement,
        state: null,
        melody: generatedMelody,
        setState: (state) => {
          this.scene.config.exercises[i].state = state
          exerciseElement.setTexture('uiMainMenu', this.scene.textureStates[state])
        }
      })
    }

    // Activar el primer ejercicio
    this.scene.currentExercise = this.scene.config.exercises[0]
    this.scene.currentExercise.setState('playing')
  }

  // Mostrar los botones de acción
  drawActionButtons () {
    // Botón para repetir la melodía generada
    const btnPlayMelody = this.scene.btnPlayMelody = this.scene.add
      .image(this.scene.screen.width - 300, this.scene.screen.height - 130, 'uiMainMenu', 'button')
      .setScale(0.7)
      .setOrigin(0.5)
      .setInteractive()

    this.scene.add.bitmapText(this.scene.screen.width - 300, this.scene.screen.height - 70, 'primaryFont', 'Melodía', 24)
      .setOrigin(0.5, 0)

    // Toggle button
    btnPlayMelody.on('pointerdown', () => {
      btnPlayMelody.setScale(0.66)
      if (this.scene.melodyState.isPlaying) {
        this.scene.melody.stopMelody()
        btnPlayMelody.setTexture('uiMainMenu', 'button')
      } else {
        this.scene.melody.playMelody(this.scene.currentExercise.melody)
        btnPlayMelody.setTexture('uiMainMenu', 'button-pressed')
      }
    })
    btnPlayMelody.on('pointerup', () => btnPlayMelody.setScale(0.7))
    btnPlayMelody.on('pointerout', () => btnPlayMelody.setScale(0.7))

    // Botón para verificar la melodía compuesta
    const btnFinish = this.scene.btnFinish = this.scene.add
      .image(this.scene.screen.width - 130, this.scene.screen.height - 130, 'uiMainMenu', 'button-pressed')
      .setScale(0.7)
      .setOrigin(0.5)
      .setInteractive()

    this.scene.add.bitmapText(this.scene.screen.width - 130, this.scene.screen.height - 70, 'primaryFont', 'Confirmar', 24)
      .setOrigin(0.5, 0)

    btnFinish.on('pointerdown', () => {
      if (!this.scene.filledSlots) { return null }
      btnFinish.setScale(0.66)
      this.scene.melody.checkMelody() // Llamada para comprobar la melodía
    })
    btnFinish.on('pointerup', () => this.scene.filledSlots && btnFinish.setScale(0.7))
    btnFinish.on('pointerout', () => this.scene.filledSlots && btnFinish.setScale(0.7))
  }
}
