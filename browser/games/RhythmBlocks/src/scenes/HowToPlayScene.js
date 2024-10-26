import Button from '../../../core/components/Button.js'
import { ASSETS } from '../../../core/constants/assets.js'
import UIAnimations from '../../../core/UIAnimations.js'

export default class HowToPlayScene extends Phaser.Scene {
  constructor () {
    super({ key: 'HowToPlayScene' })
    this.uiAnimations = new UIAnimations(this)
    this.steps = [
      'Paso 1',
      'Paso 2',
      'Paso 3',
      'Paso 4',
      'Paso 5',
      'Paso 6',
      'Paso 7',
      'Paso 8'
    ]
  }

  // Método inicial
  init () {
    this.currentStep = 0
  }

  // Método principal
  create () {
    // Botón: Ir atrás
    Button.draw(this)({
      ...ASSETS.BUTTONS.BACK,
      scene: 'MenuScene',
      position: [150, 120]
    })

    // UI y funcionalidades
    this.drawNavButtons()
    this.displayInstructions()
  }

  // Dibujar botones de navegación
  drawNavButtons () {
    const { centerX, height } = this.cameras.main

    // Botón: Paso anterior
    this.prevButton = Button.draw(this)({
      ...ASSETS.BUTTONS.ARROW_LEFT,
      position: [centerX - 100, height - 100],
      disabled: true,
      onClick: () => {
        if (this.currentStep > 0) {
          this.currentStep--
          this.updateInstructions()
        }
      }
    })

    // Botón: Paso siguiente
    this.nextButton = Button.draw(this)({
      ...ASSETS.BUTTONS.ARROW_RIGHT,
      position: [centerX + 100, height - 100],
      onClick: () => {
        if (this.currentStep < this.steps.length - 1) {
          this.currentStep++
          this.updateInstructions()
        }
      }
    })

    // Animaciones
    const onComplete = () => this.updateNavigationButtons()
    this.uiAnimations.fadeIn({ targets: this.nextButton, onComplete })
    this.uiAnimations.fadeIn({ targets: this.prevButton, duration: 200, endAlpha: 0.5 })
  }

  // Mostrar las instrucciones del juego
  displayInstructions () {
    const { width } = this.cameras.main

    // Imagen descriptiva
    this.step = this.add.image(width / 2, 190, `step${this.currentStep + 1}`)
      .setOrigin(0.5, 0)

    // Mensaje de explicación
    this.message = this.add.bitmapText(width / 2, 700, 'primaryFont', this.steps[this.currentStep], 48)
      .setOrigin(0.5, 0)
      .setMaxWidth(width - 400)
      .setCenterAlign()

    // Marco decorativo
    this.add.image(width / 2, 50, 'decorativeFrame')
      .setOrigin(0.5, 0)
      .setScale(0.77)
  }

  // Actualizar las instrucciones mostradas
  updateInstructions () {
    this.step.setTexture(`step${this.currentStep + 1}`)
    this.message.setText(this.steps[this.currentStep])
    this.uiAnimations.fadeIn({ targets: [this.step, this.message], duration: 200 })
    this.updateNavigationButtons()
  }

  // Mostrar u ocultar botones de navegación
  updateNavigationButtons () {
    const { prevButton, nextButton, currentStep, steps } = this
    prevButton.setDisabled(currentStep === 0)
    nextButton.setDisabled(currentStep === steps.length - 1)
  }
}
