import { addInteractions } from '../../../utils/addInteractions.js'

export default class UIManager {
  constructor (gameScene) {
    this.game = gameScene
    this.btnFinish = null
    this.currentExercise = null
  }

  // Dibujar botón
  drawButton ({ key, frame, scene, position: { x, y }, withInteractions = true }) {
    const button = this.game.add.image(x, y, frame, key)
      .setOrigin(0.5)
      .setInteractive()

    const navigate = () => {
      this.game.scene.start(scene)
    }

    if (withInteractions) {
      addInteractions({
        button,
        key: frame,
        frame: key,
        onClick: navigate
      })
    } else {
      button.on('pointerup', navigate)
    }

    return button
  }

  // Botón para ir atrás
  drawBackButton (scene = 'MenuScene') {
    return this.drawButton({
      key: 'back-btn',
      frame: 'btnBack',
      scene,
      position: { x: 120, y: 120 }
    })
  }

  // Crear botón para regresar a la selección de niveles
  drawHomeButton (scene = 'MenuScene') {
    return this.drawButton({
      key: 'home',
      frame: 'uiButtons',
      scene,
      position: { x: 120, y: 120 },
      withInteractions: false
    })
  }

  // Mostrar la información del nivel actual
  drawLevelInfo () {
    this.game.add.bitmapText(this.game.screen.width / 2, 100, 'primaryFont', `Jugando en el nivel #${this.game.selectedLevel}`)
      .setOrigin(0.5, 0)
  }

  // Mostrar los botones para seleccionar notas
  drawNoteButtons () {
    const layout = { gap: 10, marginTop: 700, marginRight: 150 }
    const { figures } = this.game.config
    const totalWidth = figures.length * layout.gap + (figures.length - 1) * 100
    const startX = (this.game.screen.width - totalWidth - layout.marginRight) / 2 + layout.gap / 2
    const position = { x: startX, y: layout.marginTop }

    figures.forEach((figure, index) => {
      const btnNote = this.game.add.image(position.x, position.y, figure.name)
        .setScale(0.56)
        .setOrigin(0.5)
        .setInteractive()

      position.x += layout.gap + 100

      btnNote.on('pointerdown', () => this.game.slot.handleNoteSelection(btnNote, figure.name, index))
      btnNote.on('pointerup', () => btnNote.setScale(0.56))
      btnNote.on('pointerout', () => btnNote.setScale(0.56))
    })
  }

  // Mostrar los ejercicios
  drawExercises (numExercises) {
    for (let i = 0; i <= numExercises - 1; i++) {
      const layout = { marginTop: 150, gap: 80 }
      const positionX = this.game.screen.width - 100
      const positionY = layout.marginTop + (layout.gap * (i + 1))
      const exerciseElement = this.game.add.image(positionX, positionY, 'uiMainMenu', 'button-pressed')
        .setScale(0.5)
        .setOrigin(0.5)
        .setInteractive()

      const generatedMelody = this.game.melody.generate()

      this.game.exercises.push({
        element: exerciseElement,
        state: null,
        melody: generatedMelody,
        setState: (state) => {
          this.game.exercises[i].state = state
          exerciseElement.setTexture('uiMainMenu', this.game.melody.textureStates[state])
        }
      })
    }

    // Activar el primer ejercicio
    this.game.currentExercise = this.game.exercises[0]
    this.game.currentExercise.setState('playing')
  }

  // Mostrar los botones de acción
  drawActionButtons () {
    // Botón para repetir la melodía generada
    const btnPlayMelody = this.game.melody.btnPlay = this.game.add
      .image(this.game.screen.width - 300, this.game.screen.height - 130, 'uiMainMenu', 'button')
      .setScale(0.7)
      .setOrigin(0.5)
      .setInteractive()

    this.game.add.bitmapText(this.game.screen.width - 300, this.game.screen.height - 70, 'primaryFont', 'Melodía', 24)
      .setOrigin(0.5, 0)

    // Toggle button
    btnPlayMelody.on('pointerdown', () => {
      btnPlayMelody.setScale(0.66)
      if (this.game.melody.state.isPlaying) {
        this.game.melody.stopMelody()
        btnPlayMelody.setTexture('uiMainMenu', 'button')
      } else {
        this.game.melody.playMelody(this.game.currentExercise.melody)
        btnPlayMelody.setTexture('uiMainMenu', 'button-pressed')
      }
    })
    btnPlayMelody.on('pointerup', () => btnPlayMelody.setScale(0.7))
    btnPlayMelody.on('pointerout', () => btnPlayMelody.setScale(0.7))

    // Botón para verificar la melodía compuesta
    const btnFinish = this.btnFinish = this.game.add
      .image(this.game.screen.width - 130, this.game.screen.height - 130, 'uiMainMenu', 'button-pressed')
      .setScale(0.7)
      .setOrigin(0.5)
      .setInteractive()

    this.game.add.bitmapText(this.game.screen.width - 130, this.game.screen.height - 70, 'primaryFont', 'Confirmar', 24)
      .setOrigin(0.5, 0)

    btnFinish.on('pointerdown', () => {
      if (!this.game.filledSlots) { return null }
      btnFinish.setScale(0.66)
      this.game.melody.checkMelody() // Llamada para comprobar la melodía
    })
    btnFinish.on('pointerup', () => this.game.filledSlots && btnFinish.setScale(0.7))
    btnFinish.on('pointerout', () => this.game.filledSlots && btnFinish.setScale(0.7))
  }

  disableFinishButton (state = true) {
    const texture = state ? 'button-pressed' : 'button-hovered'
    this.btnFinish.setTexture('uiMainMenu', texture)
    this.game.filledSlots = !state
  }
}
