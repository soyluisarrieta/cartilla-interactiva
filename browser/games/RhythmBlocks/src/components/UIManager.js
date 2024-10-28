import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import { Melody } from './Melody.js'

export class UIManager {
  static title = 'GAME SCENE'
  static explanation = 'Escucha la melodía, mueve cada bloque de la melodía a su correspondiente casilla.'
  static backScene = SCENES.MENU

  constructor (scene) {
    this.scene = scene
    this.melody = new Melody(scene)
  }

  // Implementación
  init () {
    this.backButton()
    this.setTitle(UIManager.title)
    this.explanation(UIManager.explanation)
    this.melodyButton()
    this.confirmButton()
  }

  // Botón: Ir atrás
  backButton () {
    Button.draw(this.scene)({
      ...BUTTONS.BACK,
      scene: UIManager.backScene,
      position: [150, 120]
    })
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
    const generatedMelody = this.melody.generate(figures, numFigures)

    const x = this.scene.cameras.main.width - 410
    const y = 600

    const label = this.scene.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Melodía', 32)
      .setOrigin(0.5)

    Button.draw(this.scene)({
      ...BUTTONS.LIST_MELODY,
      position: [x, y],
      withInteractions: false,
      onClick: async ({ button }) => {
        if (!this.melody.isPlaying) {
          label.setText('Parar')
          button.setTexture(BUTTONS.REPEAT.key, BUTTONS.REPEAT.frame)
          await this.melody.play(generatedMelody, tempo)
        }
        this.melody.stop()
        label.setText('Melodía')
        button.setTexture(BUTTONS.LIST_MELODY.key, BUTTONS.LIST_MELODY.frame)
      }
    })
  }

  // Botón: Confirmar melodía
  confirmButton () {
    const x = this.scene.cameras.main.width - 210
    const y = 600

    Button.draw(this.scene)({
      ...BUTTONS.PLAY,
      position: [x, y]
    })

    this.scene.add
      .bitmapText(x, y + 110, FONTS.PRIMARY, 'Confirmar', 32)
      .setOrigin(0.5)
  }
}
