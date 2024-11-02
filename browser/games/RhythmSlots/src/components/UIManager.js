import Button from '../../../core/components/Button.js'
import { BUTTONS, SCENES } from '../../../core/constants.js'
import { addInteractions } from '../../../core/utils/addInteractions.js'

export default class UIManager {
  constructor (scene) {
    this.scene = scene
    this.btnFinish = {}
    this.currentExercise = null
  }

  // Dibujar botón
  drawButton ({ key, frame, scene, position: { x, y }, withInteractions = true }) {
    const button = this.scene.add.image(x, y, frame, key)
      .setOrigin(0.5)
      .setInteractive()

    const navigate = () => {
      this.scene.sound.play('soundPress')
      this.scene.scene.start(scene)
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
      position: { x: 150, y: 120 }
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

  // Botón: Salir de la partida
  drawExitButton () {
    const button = Button.draw(this.scene)({
      ...BUTTONS.HOME,
      position: [120, 120],
      onClick: () => {
        this.scene.melody.btnPlay.setTexture('uiButtons', 'listen-melody')
        this.scene.melody.stopMelody()
        this.scene.alert.showAlert('¿Estás seguro?', {
          type: 'warning',
          image: 'gameLogo',
          message: 'Si sales, tendrás que volver a empezar una nueva partida.',
          buttons: [
            {
              text: 'Salir',
              onClick: () => {
                this.scene.scene.start(SCENES.MENU)
              }
            },
            { text: 'Cancelar' }
          ]
        })
      }
    }).setScale(0.9)

    this.scene.animations.fadeIn({
      targets: button,
      duration: 300,
      delay: 300
    })
  }

  // Mostrar la información del nivel actual
  drawLevelInfo () {
    this.scene.add.bitmapText(this.scene.screen.width / 2, 100, 'primaryFont', `Jugando en el nivel #${this.scene.level.index}`)
      .setOrigin(0.5, 0)
  }

  // Mostrar los botones para seleccionar notas
  drawNoteButtons () {
    const layout = { gap: 10, marginTop: 700, marginRight: 150 }
    const { figures } = this.scene.level
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

      const baseDelay = 200
      this.scene.animations.scaleUp({
        targets: btnNote,
        duration: 600,
        delay: baseDelay + index * 100,
        endScale: 0.56
      })
    })
  }

  // Mostrar los ejercicios
  drawExercises (numExercises) {
    for (let i = 0; i <= numExercises - 1; i++) {
      const layout = { marginTop: 200, gap: 95 }
      const positionX = this.scene.screen.width - 50
      const positionY = layout.marginTop + (layout.gap * (i + 1))
      const exerciseTextures = this.scene.melody.textureStates
      const exerciseElement = this.scene.add.image(positionX, positionY, 'exercise', exerciseTextures.pending)
        .setScale(0.7)
        .setOrigin(1, 0.5)
        .setInteractive()

      const generatedMelody = this.scene.melody.generate()

      this.scene.exercises.push({
        element: exerciseElement,
        state: null,
        melody: generatedMelody,
        setState: (state) => {
          this.scene.exercises[i].state = state
          exerciseElement
            .setTexture('exercise', exerciseTextures[state])
            .setScale(0.8)
        }
      })

      const baseDelay = 300
      this.scene.animations.slideInFromRight({
        targets: exerciseElement,
        duration: 300,
        delay: baseDelay + i * 120
      })
    }

    // Activar el primer ejercicio
    this.scene.currentExercise = this.scene.exercises[0]
    this.scene.currentExercise.setState('playing')
  }

  // Mostrar los botones de acción
  drawActionButtons () {
    // Botón para repetir la melodía generada
    const btnPlayMelody = this.scene.melody.btnPlay = this.scene.add
      .image(this.scene.screen.width / 2.35, this.scene.screen.height - 140, 'uiButtons', 'listen-melody')
      .setScale(0.8)
      .setOrigin(0.5)
      .setInteractive()

    const btnPlayMelodyLabel = this.scene.add.bitmapText(
      this.scene.screen.width / 2.35,
      this.scene.screen.height - 70,
      'primaryFont',
      'Melodía',
      24
    )

    btnPlayMelodyLabel.setOrigin(0.5, 0)

    // Toggle button
    btnPlayMelody.on('pointerdown', () => {
      btnPlayMelody.setScale(0.66)
      if (this.scene.melody.state.isPlaying) {
        this.scene.melody.stopMelody()
        btnPlayMelody.setTexture('uiButtons', 'listen-melody')
      } else {
        this.scene.melody.playMelody(this.scene.currentExercise.melody)
        btnPlayMelody.setTexture('uiButtons', 'repeat')
      }
    })
    btnPlayMelody.on('pointerup', () => btnPlayMelody.setScale(0.8))
    btnPlayMelody.on('pointerout', () => btnPlayMelody.setScale(0.8))

    // Botón para verificar la melodía compuesta
    const btnFinish = this.scene.add
      .image(this.scene.screen.width / 1.99, this.scene.screen.height - 140, 'uiButtons', 'play')
      .setScale(0.8)
      .setOrigin(0.5)
      .setInteractive()

    const btnFinishLabel = this.scene.add.bitmapText(
      this.scene.screen.width / 1.99,
      this.scene.screen.height - 70,
      'primaryFont',
      'Confirmar',
      24
    )

    btnFinishLabel.setOrigin(0.5, 0)

    btnFinish.on('pointerdown', () => {
      if (!this.scene.filledSlots) { return null }
      this.scene.melody.checkMelody() // Llamada para comprobar la melodía
    })

    this.btnFinish = {
      button: btnFinish,
      label: btnFinishLabel
    }

    // Animations
    const baseDelay = 400
    this.scene.animations.slideInFromBottom({
      targets: btnPlayMelody,
      duration: 700,
      delay: baseDelay + 100
    })
    this.scene.animations.slideInFromBottom({
      targets: btnFinish,
      duration: 700,
      delay: baseDelay + 100,
      endAlpha: 0.4
    })

    this.scene.animations.fadeIn({
      targets: btnPlayMelodyLabel,
      duration: 350,
      delay: baseDelay + 700
    })
    this.scene.animations.fadeIn({
      targets: btnFinishLabel,
      duration: 350,
      delay: baseDelay + 700,
      endAlpha: 0.4
    })
  }

  disableFinishButton (state = true) {
    this.btnFinish.button.alpha = state ? 0.4 : 1
    this.btnFinish.label.alpha = state ? 0.4 : 1
    this.scene.filledSlots = !state
  }
}
