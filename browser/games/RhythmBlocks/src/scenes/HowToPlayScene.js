import Button from '../../../core/components/Button.js'
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
      key: 'btnBack',
      frame: 'back-btn',
      scene: 'MenuScene',
      position: [150, 120]
    })

    // UI y funcionalidades
    this.drawNavButtons()
    this.updateNavigationButtons()
    this.displayInstructions()
  }

  // Botones de navegación
  drawNavButtons () {
    const { centerX, height } = this.cameras.main

    // Botón: Paso anterior
    this.prevButton = Button.draw(this)({
      key: 'uiButtons',
      frame: 'arrow-right',
      position: [centerX + 100, height - 100]
    })

    this.prevButton.on('pointerdown', () => {
      if (this.currentStep > 0) {
        this.currentStep--
        this.updateInstructions()
      }
    })

    // Botón: Paso siguiente
    this.nextButton = Button.draw(this)({
      key: 'uiButtons',
      frame: 'arrow-right',
      position: [centerX + 100, height - 100]
    })

    this.nextButton.on('pointerdown', () => {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++
        this.updateInstructions()
      }
    })

    // Animaciones
    this.uiAnimations.fadeIn({ targets: [this.nextButton, this.prevButton] })
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
    this.prevButton.setVisible(this.currentStep > 0)
    this.nextButton.setVisible(this.currentStep < this.steps.length - 1)
  }
}
