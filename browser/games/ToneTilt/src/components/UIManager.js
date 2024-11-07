import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'

export default class UIManager {
  static title = '¿El segundo tono sube o baja?'

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
  }

  // Títular
  setTitle (text) {
    const { width } = this.scene.cameras.main
    return this.scene.add
      .bitmapText(width / 2, 100, FONTS.PRIMARY, text)
      .setOrigin(0.5, 0)
  }
}
