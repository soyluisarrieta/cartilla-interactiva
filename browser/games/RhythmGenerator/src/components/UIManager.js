import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'

export default class UIManager {
  static title = 'Generador de ritmos'

  constructor (scene) {
    this.scene = scene
  }

  // Implementación
  init () {
    this.homeButton()
    this.setTitle(UIManager.title)
    this.drawActionButtons()
  }

  // Botón: Salir de la partida
  homeButton () {
    Button.draw(this.scene)({
      ...BUTTONS.HOME,
      position: [120, 120],
      onClick: () => {
        this.scene.melody.stop()
        this.scene.alert.showAlert('¿Estás seguro?', {
          type: 'warning',
          image: 'gameLogo',
          message: 'Si sales, tendrás que volver a empezar una nueva partida.',
          buttons: [
            {
              text: 'Salir',
              onClick: () => {
                this.scene.melody.stop()
                this.scene.scene.start(SCENES.MENU)
              }
            },
            { text: 'Cancelar' }
          ]
        })
      }
    }).setScale(0.9)
  }

  // Títular
  setTitle (text) {
    const { width } = this.scene.cameras.main
    return this.scene.add
      .bitmapText(width / 2, 100, FONTS.PRIMARY, text)
      .setOrigin(0.5, 0)
  }

  // Botones de acción
  drawActionButtons () {
    const buttonDimensions = { width: 300, height: 300 }
    this.buttons = [
      {
        label: 'Reproducir',
        texture: BUTTONS.PLAY,
        handleEvent: this.playButton.bind(this)
      },
      {
        label: 'Detener',
        texture: BUTTONS.REPEAT,
        handleEvent: () => this.scene.melody.stop()
      },
      {
        label: 'Generar',
        texture: BUTTONS.LISTEN_MELODY,
        handleEvent: this.scene.start.bind(this.scene)
      },
      {
        label: 'Acelerar',
        texture: BUTTONS.ARROW_RIGHT,
        handleEvent: () => this.speedMelodyButton.bind(this)(+1)
      },
      {
        label: 'Desacelerar',
        texture: BUTTONS.ARROW_LEFT,
        handleEvent: () => this.speedMelodyButton.bind(this)(-1)
      }
    ]

    grid({
      totalItems: 5,
      item: buttonDimensions,
      maxColumns: 5,
      gap: 30,
      position: [300, 900],
      element: ({ x, y }, i) => {
        const { label: labelText, texture, handleEvent } = this.buttons[i]
        const label = this.scene.add
          .bitmapText(x, y + 110, FONTS.PRIMARY, labelText, 32)
          .setOrigin(0.5)

        Button.draw(this.scene)({
          ...texture,
          position: [x, y],
          withInteractions: false,
          onClick: ({ button }) => handleEvent({ label, button })
        })
      }
    })
  }

  // Reproducir melodía
  async playButton ({ label, button }) {
    const { tempo } = this.scene.game
    if (!this.scene.melody.playing) {
      label.setText('Detener')
      button.setTexture(BUTTONS.REPEAT.key, BUTTONS.REPEAT.frame)
      const melody = this.scene.melody.current
      await this.scene.melody.play(melody, tempo)
    }
    this.scene.melody.stop()
    label.setText('Reproducir')
    button.setTexture(BUTTONS.PLAY.key, BUTTONS.PLAY.frame)
  }

  // Generar meloadía aleatoria
  generateButton () {
    console.log('generar melodía')
  }

  // Acelerar/Desacelerar
  speedMelodyButton (speed) {
    console.log(speed === 1 ? 'Acelerar' : 'Desacelerar')
  }
}
