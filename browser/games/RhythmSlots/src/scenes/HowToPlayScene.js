import { addInteractions } from '../../../utils/addInteractions.js'

export default class HowToPlayScene extends Phaser.Scene {
  constructor () {
    super({ key: 'HowToPlayScene' })
    this.settings = window.gameSettings
    this.currentStep = 0
    this.steps = [
      '¡Bienvenido! En este juego aprenderás a identificar las figuras musicales usando tu oído. ¡Disfruta la experiencia!',
      'Primero, necesitas escuchar la melodía que tienes que recrear. ¡Pulsa el botón para reproducirla!',
      'En la parte inferior, encontrarás los botones de cada figura musical. ¡Presiónalos para colocarlos en los espacios correspondientes!',
      '¿Necesitas modificar una figura? Solo haz clic en la nota que quieres cambiar y reemplazalo con una nueva figura.',
      'Escucha la melodía tantas veces como necesites. Cuando estés listo, haz clic en el botón para confirmar tu composición.',
      'Si tu melodía es correcta, pasarás al siguiente ejercicio. Si no, perderás una vida. ¡No te preocupes, tienes 3 vidas en total!',
      'Es necesario corregir las notas incorrectas para poder avanzar al siguiente ejercicio.',
      'Completa los 7 ejercicios y sus melodías para superar cada nivel. ¡Buena suerte y diviértete aprendiendo!'
    ]
  }

  create () {
    this.createBackButton()
    this.createNavigationButtons()
    this.displayInstructions()
  }

  // Crear botón para regresar a la selección de niveles
  createBackButton () {
    const { height: screenHeight } = this.cameras.main
    const homeButton = this.add.image(100, screenHeight - 100, 'uiLvlSelection', 'btn-home')
      .setScale(1.5)
      .setOrigin(0.5)
      .setInteractive()

    addInteractions({
      button: homeButton,
      key: 'uiLvlSelection',
      frame: 'btn-home',
      onClick: () => {
        this.scene.start('MenuScene')
      }
    })
  }

  // Crear botones de navegación
  createNavigationButtons () {
    const { width: screenWidth, height: screenHeight } = this.cameras.main

    this.add.image(screenWidth / 1.8, screenHeight - 100, 'uiButtons', 'arrow-right')
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.currentStep < this.steps.length - 1) {
          this.currentStep++
          this.updateInstructions()
        }
      })

    this.add.image(screenWidth / 2.2, screenHeight - 100, 'uiButtons', 'arrow-left')
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.currentStep > 0) {
          this.currentStep--
          this.updateInstructions()
        }
      })
  }

  // Mostrar las instrucciones del juego
  displayInstructions () {
    const { width: screenWidth } = this.cameras.main
    this.title = this.add.bitmapText(screenWidth / 2, 100, 'primaryFont', '¡Cómo jugar!')
      .setOrigin(0.5, 0)

    this.gif = this.add.image(screenWidth / 2, 230, `step${this.currentStep + 1}`)
      .setOrigin(0.5, 0)

    this.message = this.add.bitmapText(screenWidth / 2, 700, 'primaryFont', this.steps[this.currentStep], 48)
      .setOrigin(0.5, 0)
      .setMaxWidth(screenWidth - 400)
      .setCenterAlign()
  }

  // Actualizar las instrucciones mostradas
  updateInstructions () {
    this.gif.setTexture(`step${this.currentStep + 1}`)
    this.message.setText(this.steps[this.currentStep])
  }
}
