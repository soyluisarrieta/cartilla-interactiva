import Button from '../../../core/components/Button.js'
import UIAnimations from '../../../core/UIAnimations.js'
import { SCENES, BUTTONS, FONTS, IMAGES } from '../../../core/constants.js'
import { STEPS } from '../../assets/how-to-play/intructions.js'

export default class HowToPlayScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.HOW_TO_PLAY })
    this.uiAnimations = new UIAnimations(this)
  }

  // Método inicial
  init () {
    this.currentStep = 0
  }

  // Método principal
  create () {
    // Botón: Ir atrás
    Button.draw(this)({
      ...BUTTONS.BACK,
      scene: SCENES.MENU,
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
      ...BUTTONS.ARROW_LEFT,
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
      ...BUTTONS.ARROW_RIGHT,
      position: [centerX + 100, height - 100],
      onClick: () => {
        if (this.currentStep < STEPS.length - 1) {
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
    this.message = this.add.text(width / 2, 700, STEPS[this.currentStep], {
      fontSize: '48px',
      fontFamily: FONTS.SECONDARY,
      color: '#ffffff',
      wordWrap: { width: width - 400 },
      align: 'center'
    }).setOrigin(0.5, 0)

    // Marco decorativo
    this.add.image(width / 2, 50, IMAGES.DECORATIVE_FRAME)
      .setOrigin(0.5, 0)
      .setScale(0.77)
  }

  // Actualizar las instrucciones mostradas
  updateInstructions () {
    this.step.setTexture(`step${this.currentStep + 1}`)
    this.message.setText(STEPS[this.currentStep])
    this.uiAnimations.fadeIn({ targets: [this.step, this.message], duration: 200 })
    this.updateNavigationButtons()
  }

  // Mostrar u ocultar botones de navegación
  updateNavigationButtons () {
    const { prevButton, nextButton, currentStep } = this
    prevButton.setDisabled(currentStep === 0)
    nextButton.setDisabled(currentStep === STEPS.length - 1)
  }
}
