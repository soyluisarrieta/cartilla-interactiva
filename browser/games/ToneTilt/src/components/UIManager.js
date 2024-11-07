import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'

export default class UIManager {
  static title = 'Generador de ritmos'

  constructor (scene) {
    this.scene = scene
  }

  // Implementación
  init () {
    this.homeButton()
    this.setTitle(UIManager.title)
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
  }

  // Títular
  setTitle (text) {
    const { width } = this.scene.cameras.main
    return this.scene.add
      .bitmapText(width / 2, 100, FONTS.PRIMARY, text)
      .setOrigin(0.5, 0)
  }
}
