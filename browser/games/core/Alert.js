import UIAnimations from './UIAnimations.js'
import { FONTS } from './constants.js'

export default class Alert {
  constructor (scene) {
    this.scene = scene
    this.uiAnimations = new UIAnimations(scene)
  }

  showAlert (title, {
    type = 'default',
    duration = 0,
    width = 400,
    height = 200,
    dismissible = true,
    image = null,
    message = '',
    buttons = [],
    btnAccept = false
  } = {}) {
    width += image ? 300 : 0
    height += image ? 300 : 0

    // Crear un contenedor para toda la alerta centrada
    const alertContainer = this.scene.add
      .container(this.scene.scale.width / 2, this.scene.scale.height / 2)
      .setSize(width, height)
      .setDepth(1000)

    // Crear un fondo de interacción (zone)
    const overlayZone = this.scene.add
      .zone(0, 0, this.scene.scale.width, this.scene.scale.height)
      .setOrigin(0.5)
      .setInteractive()
    alertContainer.add(overlayZone)

    // Crear el fondo de transparencia
    const overlayBackground = this.scene.add.graphics()
    overlayBackground.fillStyle(0x000000, 0.5)
    overlayBackground.fillRect(-this.scene.scale.width / 2, -this.scene.scale.height / 2, this.scene.scale.width, this.scene.scale.height)

    alertContainer.add(overlayBackground)

    // Fondo del modal con borde redondeado
    const modalBackground = this.scene.add.graphics()
    modalBackground.fillStyle(this.getColor(type), 1)
    modalBackground.fillRoundedRect(-width / 2, -height / 2, width, height, 20)

    alertContainer.add(modalBackground)

    // Imagen opcional
    if (image) {
      const modalImage = this.scene.add.image(0, -height / 2 + 170, image).setScale(0.5)
      alertContainer.add(modalImage)
    }

    // Título del modal
    if (title) {
      const modalTitle = this.scene.add.bitmapText(0, -height / 2 + (image ? 325 : (message ? 50 : 60)), FONTS.PRIMARY, title, 40)
        .setOrigin(0.5, 0)
      alertContainer.add(modalTitle)
    }

    // Texto opcional
    if (message) {
      const modalText = this.scene.add.bitmapText(0, -height / 2 + (image ? 380 : 100), FONTS.SECONDARY, message, 24)
        .setOrigin(0.5, 0)
        .setMaxWidth(width - 50)
        .setCenterAlign()
      alertContainer.add(modalText)
    }

    // Botones opcionales
    const gapX = 100
    const totalButtonWidth = buttons.length * 100 + (buttons.length - 1) * gapX
    const startX = -totalButtonWidth / 2 + 50

    buttons.forEach(({ text, onClick }, index) => {
      const buttonX = startX + index * (100 + gapX)
      const buttonY = height / 2 - 50

      const buttonText = this.scene.add.text(buttonX, buttonY, text, {
        fontSize: '20px',
        fill: '#ffffff'
      })
        .setOrigin(0.5)
        .setInteractive()

      buttonText.on('pointerdown', () => {
        onClick && onClick()
        this.dismissAlert(alertContainer)
      })
      alertContainer.add(buttonText)
    })

    // Botón de aceptar
    if (btnAccept) {
      const buttonAccept = this.scene.add.text(0, height / 2 - 30, 'Aceptar', {
        fontSize: '20px',
        fill: '#ffffff'
      })
        .setOrigin(0.5)
        .setInteractive()

      buttonAccept.on('pointerdown', () => this.dismissAlert(alertContainer))
      alertContainer.add(buttonAccept)
    }

    // Botón de cierre si es descartable
    if (dismissible) {
      const closeButton = this.scene.add.text(width / 2 - 30, -height / 2 + 30, '✖', {
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5)

      closeButton.setInteractive()
      closeButton.on('pointerdown', () => this.dismissAlert(alertContainer))
      alertContainer.add(closeButton)
    }

    // Añadir la alerta al contenedor
    this.scene.add.existing(alertContainer)

    // Añadir animación de entrada
    this.uiAnimations.scaleUp({
      targets: alertContainer,
      duration: 200,
      delay: 0
    })

    // Descartar automáticamente después de la duración
    if (duration > 0) {
      this.scene.time.addEvent({
        delay: duration,
        callback: () => this.dismissAlert(alertContainer),
        callbackScope: this
      })
    }
  }

  getColor (type) {
    switch (type) {
      case 'success': return 0x4CAF50
      case 'error': return 0xF44336
      case 'warning': return 0xff9800
      case 'info': return 0x2196F3
      default: return 0x111111
    }
  }

  dismissAlert (alertContainer) {
    this.uiAnimations.scaleDown({
      targets: alertContainer,
      duration: 200,
      delay: 0
    })

    // Destruir el contenedor después de la animación
    this.scene.time.addEvent({
      delay: 200,
      callback: () => {
        alertContainer.destroy()
      },
      callbackScope: this
    })
  }
}
