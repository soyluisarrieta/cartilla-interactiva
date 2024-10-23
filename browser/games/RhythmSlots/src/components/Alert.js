export default class Alert {
  constructor (gameScene) {
    this.game = gameScene
  }

  showAlert (title, {
    type = 'default',
    duration = 3000,
    width = 400,
    height = 200,
    dismissible = true,
    image = null,
    message = '',
    buttons = [],
    btnAccept = false
  } = {}) {
    // Crear un contenedor para toda la alerta
    const alertContainer = this.game.add.container(0, 0)

    // Crear un fondo de interacción (zone)
    const overlayZone = this.game.add.zone(0, 0, this.game.scale.width, this.game.scale.height).setOrigin(0).setInteractive()
    alertContainer.add(overlayZone)

    // Crear el fondo de transparencia
    const overlayBackground = this.game.add.graphics()
    overlayBackground.fillStyle(0x000000, 0.5) // Color negro con 0.5 de transparencia
    overlayBackground.fillRect(0, 0, this.game.scale.width, this.game.scale.height)

    alertContainer.add(overlayBackground)

    width += image ? 300 : 0
    height += image ? 300 : 0

    // Fondo del modal con borde redondeado
    const modalBackground = this.game.add.graphics()
    modalBackground.fillStyle(this.getColor(type), 1)
    modalBackground.fillRoundedRect(this.game.scale.width / 2 - width / 2, this.game.scale.height / 2 - height / 2, width, height, 20) // 20 es el radio del borde

    alertContainer.add(modalBackground)

    // Imagen opcional
    if (image) {
      const modalImage = this.game.add.image(this.game.scale.width / 2, this.game.scale.height / 2 - height / 2 + 170, image).setScale(0.5)
      alertContainer.add(modalImage)
    }

    // Título del modal
    if (title) {
      const modalTitle = this.game.add.bitmapText(this.game.scale.width / 2, this.game.scale.height / 2 - height / 2 + (image ? 325 : (message ? 50 : 60)), 'primaryFont', title, 40)
        .setOrigin(0.5, 0)
      alertContainer.add(modalTitle)
    }

    // Texto opcional
    if (message) {
      const modalText = this.game.add.bitmapText(this.game.scale.width / 2, this.game.scale.height / 2 - height / 2 + (image ? 380 : 100), 'primaryFont', message, 24)
        .setOrigin(0.5, 0)
        .setMaxWidth(width - 50)
        .setCenterAlign()
      alertContainer.add(modalText)
    }

    // Botones opcionales
    const gapX = 100
    const totalButtonWidth = buttons.length * 100 + (buttons.length - 1) * gapX
    const startX = this.game.scale.width / 2 - totalButtonWidth / 2 + 50

    buttons.forEach(({ text, onClick }, index) => {
      const buttonX = startX + index * (100 + gapX)
      const buttonY = this.game.scale.height / 2 + height / 2 - 50

      const buttonText = this.game.add.text(buttonX, buttonY, text, {
        fontSize: '20px',
        fill: '#ffffff'
      })
        .setOrigin(0.5)
        .setInteractive()

      buttonText.on('pointerdown', onClick)
      alertContainer.add(buttonText)
    })

    // Botón de aceptar
    if (btnAccept) {
      const buttonAccept = this.game.add.text(this.game.scale.width / 2, this.game.scale.height / 2 + height / 2 - 30, 'Aceptar', {
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
      const closeButton = this.game.add.text(this.game.scale.width / 2 + width / 2 - 30, this.game.scale.height / 2 - height / 2 + 30, '✖', {
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: 'bold'
      }).setOrigin(0.5)

      closeButton.setInteractive()
      closeButton.on('pointerdown', () => this.dismissAlert(alertContainer))
      alertContainer.add(closeButton)
    }

    // Añadir la alerta al contenedor
    this.game.add.existing(alertContainer)

    // Descartar automáticamente después de la duración
    if (duration > 0) {
      this.game.time.addEvent({
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
    this.game.tweens.add({
      targets: alertContainer,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        alertContainer.destroy()
      }
    })
  }
}
