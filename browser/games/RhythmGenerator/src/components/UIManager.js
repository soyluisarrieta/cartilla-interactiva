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
    this.drawTempo()
    this.drawFiguresInvolved()
    this.drawActionButtons()
  }

  // Botón: Salir de la partida
  homeButton () {
    const button = Button.draw(this.scene)({
      ...BUTTONS.HOME,
      position: [120, 120],
      onClick: () => {
        this.scene.melody.stop()
        this.scene.alert.showAlert('¿Estás seguro?', {
          type: 'warning',
          image: 'gameLogo',
          message: 'Si sales, probablemente no se genere el mismo ritmo.',
          buttons: [
            {
              text: 'Salir',
              onClick: () => {
                this.scene.melody.stop()
                this.scene.scene.start(SCENES.LEVEL_SELECTION)
              }
            },
            { text: 'Cancelar' }
          ]
        })
      }
    }).setScale(0.9)

    this.scene.uiAnimations.slideInFromLeft({ targets: button })
  }

  // Títular
  setTitle (text) {
    const { width } = this.scene.cameras.main
    return this.scene.add
      .bitmapText(width / 2, 100, FONTS.PRIMARY, text)
      .setOrigin(0.5, 0)
  }

  // Figuras involucradas
  drawFiguresInvolved () {
    const { width } = this.scene.cameras.main
    const { figures } = this.scene.level
    const figureWidth = 40

    grid({
      totalItems: figures.length,
      item: { width: figureWidth },
      maxColumns: figures.length,
      gap: figureWidth * 3,
      position: [width / 2, 330],
      alignCenter: true,
      element: ({ x, y }, i) => {
        const image = this.scene.add
          .image(x, y, 'figures', figures[i].name)
          .setOrigin(0, 1)

        const aspectRatio = image.height / image.width
        const fixedHeight = figureWidth * aspectRatio
        image.setDisplaySize(figureWidth, fixedHeight)

        const label = this.scene.add
          .bitmapText(x + figureWidth / 2, y + 20, FONTS.PRIMARY, figures[i].title, 19)
          .setOrigin(0.5, 0)
          .setCenterAlign()
          .setMaxWidth(figureWidth * 4)

        this.scene.uiAnimations.slideInFromTop({
          targets: [image, label],
          delay: 600
        })
      }
    })

    const subTitle = this.scene.add
      .bitmapText(width / 2, 430, FONTS.PRIMARY, 'Figuras involucradas', 28)
      .setOrigin(0.5)

    this.scene.uiAnimations.fadeIn({
      targets: subTitle,
      delay: 600
    })
  }

  // Indicador de Tempo en segundos
  drawTempo () {
    const { width } = this.scene.cameras.main
    const tempo = this.scene.game.tempo
    const bpm = Math.round(60000 / tempo)
    this.tempoIndicator = this.scene.add
      .bitmapText(width - 50, 50, FONTS.PRIMARY, `Tempo: ${bpm} BPM`, 32
      ).setOrigin(1, 0)

    this.updateTempo(tempo)

    this.scene.uiAnimations.slideInFromRight({ targets: this.tempoIndicator })
  }

  // Método para actualizar el indicador de tempo
  updateTempo (newTempo) {
    const bpm = Math.round(60000 / newTempo)
    this.tempoIndicator.setText(`Tempo: ${bpm} BPM`)
  }

  // Botones de acción
  drawActionButtons () {
    const buttonDimensions = { width: 300, height: 300 }
    this.buttons = [
      {
        label: 'Reproducir',
        texture: BUTTONS.PLAY,
        handleEvent: this.handlePlay.bind(this)
      },
      {
        label: 'Detener',
        texture: BUTTONS.REPEAT,
        handleEvent: this.handleStop.bind(this)
      },
      {
        label: 'Generar',
        texture: BUTTONS.LISTEN_MELODY,
        handleEvent: this.scene.start.bind(this.scene)
      },
      {
        label: 'Acelerar',
        texture: BUTTONS.ARROW_RIGHT,
        handleEvent: () => this.speedMelodyButton.bind(this)(-1)
      },
      {
        label: 'Desacelerar',
        texture: BUTTONS.ARROW_LEFT,
        handleEvent: () => this.speedMelodyButton.bind(this)(1)
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

        const button = Button.draw(this.scene)({
          ...texture,
          position: [x, y],
          withInteractions: false,
          onClick: ({ button }) => handleEvent({ label, button })
        })

        this.buttons[i].elements = { label, button }

        this.scene.uiAnimations.slideInFromBottom({
          targets: [label, button],
          delay: 600
        })
      }
    })
  }

  // Reproducir melodía
  async handlePlay ({ label, button }) {
    const { tempo } = this.scene.game
    const melody = this.scene.melody
    const intervals = this.scene.intervals

    if (!melody.playing) {
      const generateButton = this.buttons[2].elements
      const accelerateButton = this.buttons[3].elements
      const decelerateButton = this.buttons[4].elements

      generateButton.button.setDisabled(true)
      accelerateButton.button.setDisabled(true)
      decelerateButton.button.setDisabled(true)

      label.setText('Pausar')
      button.setTexture(BUTTONS.REPEAT.key, BUTTONS.REPEAT.frame)
      const onSound = ({ index }) => intervals.select(index).setActived(true)
      await melody.play(melody.current, tempo, onSound)

      intervals.resetAll()
      melody.stop()
      label.setText('Reproducir')
      button.setTexture(BUTTONS.PLAY.key, BUTTONS.PLAY.frame)

      generateButton.button.setDisabled(false)
      accelerateButton.button.setDisabled(false)
      decelerateButton.button.setDisabled(false)
    } else if (melody.paused) {
      label.setText('Pausar')
      button.setTexture(BUTTONS.REPEAT.key, BUTTONS.REPEAT.frame)
      melody.resume()
    } else if (!melody.paused) {
      label.setText('Reanudar')
      button.setTexture(BUTTONS.REPEAT.key, BUTTONS.REPEAT.frame)
      melody.pause()
    }
  }

  handleStop () {
    this.scene.intervals.resetAll()
    this.scene.melody.stop()

    const playButton = this.buttons[0].elements
    const generateButton = this.buttons[2].elements
    const accelerateButton = this.buttons[3].elements
    const decelerateButton = this.buttons[4].elements

    playButton.label.setText('Reproducir')
    playButton.button.setTexture(BUTTONS.PLAY.key, BUTTONS.PLAY.frame)

    generateButton.button.setDisabled(false)
    accelerateButton.button.setDisabled(false)
    decelerateButton.button.setDisabled(false)
  }

  // Acelerar/Desacelerar
  speedMelodyButton (speed) {
    const game = this.scene.game
    const tempoIncrement = 100
    game.tempo += speed * tempoIncrement
    game.tempo = Math.max(200, Math.min(game.tempo, 2000))
    this.updateTempo(game.tempo)
  }
}
