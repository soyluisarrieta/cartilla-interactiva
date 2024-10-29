import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'

export default class UIManager {
  static title = 'GAME SCENE'
  static explanation = 'Escucha la melodía, mueve cada bloque de la melodía a su correspondiente casilla.'

  constructor (scene) {
    this.scene = scene
  }

  // Implementación
  init () {
    this.homeButton()
    this.setTitle(UIManager.title)
    this.explanation(UIManager.explanation)
    this.melodyButton()
    this.confirmButton()
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

  // Explicación corta
  explanation (text) {
    const { width } = this.scene.cameras.main
    this.scene.add
      .bitmapText(width - 70, 450, FONTS.SECONDARY, text, 38)
      .setOrigin(1)
      .setMaxWidth(500)
  }

  // Botón: Reproducir melodía
  melodyButton () {
    const { tempo } = this.scene.game
    const { figures, metrics } = this.scene.level
    const numFigures = metrics.figures * metrics.slots
    const generatedMelody = this.scene.melody.generate(figures, numFigures)

    const x = this.scene.cameras.main.width - 410
    const y = 600

    const label = this.scene.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Melodía', 32)
      .setOrigin(0.5)

    Button.draw(this.scene)({
      ...BUTTONS.LIST_MELODY,
      position: [x, y],
      withSound: false,
      withInteractions: false,
      onClick: async ({ button }) => {
        if (!this.scene.melody.isPlaying) {
          label.setText('Parar')
          button.setTexture(BUTTONS.REPEAT.key, BUTTONS.REPEAT.frame)
          await this.scene.melody.play(generatedMelody, tempo)
        }
        this.scene.melody.stop()
        label.setText('Melodía')
        button.setTexture(BUTTONS.LIST_MELODY.key, BUTTONS.LIST_MELODY.frame)
      }
    })
  }

  // Botón: Confirmar melodía
  confirmButton () {
    const x = this.scene.cameras.main.width - 210
    const y = 600

    const button = Button.draw(this.scene)({
      ...BUTTONS.PLAY,
      position: [x, y],
      onClick: () => {
        const groupedMelody = this.scene.slots.map(slot => (
          slot.currentBlock.figures
        ))

        const composition = []
        groupedMelody.forEach((figuras) => {
          composition.push(figuras[0].getData('figure'))
          composition.push(figuras[1].getData('figure'))
        })

        const mistakes = this.scene.melody.check(composition)

        // Composición incorrecta
        if (mistakes) {
          const totalHealth = this.scene.health.miss()
          const isGameOver = totalHealth === 0
          const isPlural = mistakes.length > 1 ? 's' : ''
          const alert = {
            title: '¡Composición incorrecta!',
            type: 'error',
            image: 'gameLogo',
            message: `Debes corregir la${isPlural} nota${isPlural}. ¡Te quedan ${totalHealth} vidas!`
          }

          if (isGameOver) {
            alert.title = '¡Fin del juego'
            alert.type = 'default'
            alert.image = 'gameLogo'
            alert.message = 'Has perdido todas tus vidas, ¡pero puedes volver a intentarlo!'

            this.scene.melody.stop()
            this.scene.sound.stopAll()
            this.scene.sound.play('gameOver')
          }

          const buttons = [
            {
              text: 'Volver a jugar',
              onClick: () => {
                this.scene.scene.start(SCENES.GAME, this.scene.selectedLevel)
              }
            },
            {
              text: 'Niveles',
              onClick: () => {
                // this.scene.scene.start(SCENES.LEVEL_SELECTION)
              }
            }
          ]

          this.scene.alert.showAlert(alert.title, {
            type: alert.type,
            image: alert.image,
            message: alert.message,
            btnAccept: !isGameOver,
            buttons: isGameOver ? buttons : [],
            dismissible: false
          })

          return
        }

        // Composición correcta
        this.scene.alert.showAlert('¡Perfecto!', {
          type: 'success',
          image: 'gameLogo',
          message: 'Has avanzado al siguiente ejercicio.',
          btnAccept: true
        })
      }
    })

    const label = this.scene.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Confirmar', 32)
      .setOrigin(0.5)

    const setDisabled = (disable) => {
      button.setDisabled(disable)
      label.setAlpha(disable ? 0.5 : 1)
    }

    setDisabled(true)
    this.scene.confirmButton = { setDisabled }
  }
}
