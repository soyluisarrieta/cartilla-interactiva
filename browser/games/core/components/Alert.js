import UIAnimations from '../UIAnimations.js'
import { ALERTS, FONTS } from '../constants.js'

export default class Alert {
  static textures = {
    warning: ALERTS.WARN,
    gameover: ALERTS.GAMEOVER,
    success: ALERTS.SUCCESS,
    completed: ALERTS.COMPLETED,
    error: ALERTS.FAILED
  }

  constructor (scene) {
    this.scene = scene
    this.uiAnimations = new UIAnimations(scene)
  }

  showAlert (title, {
    type = 'error',
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

    const { BG, ICON } = Alert.textures[type]

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

    // Imagen de fondo del modal
    const modalBackground = this.scene.add
      .image(0, 0, ALERTS.KEY, BG)
      .setDisplaySize(width, height)
    alertContainer.add(modalBackground)

    // Imagen opcional
    const modalImage = this.scene.add
      .image(0, -height / 2 + 110, ALERTS.KEY, ICON)
      .setScale(0.6)
    alertContainer.add(modalImage)

    // Título del modal
    const modalTitle = this.scene.add.text(0, -height / 2 + 235, title, {
      fontSize: '60px',
      fontFamily: FONTS.PRIMARY,
      color: '#ffffff'
    }).setOrigin(0.5, 0)
    alertContainer.add(modalTitle)

    // Texto opcional
    if (message) {
      const modalText = this.scene.add.text(0, -height / 2 + 340, message, {
        fontSize: '28px',
        fontFamily: FONTS.SECONDARY,
        color: '#ffffff',
        wordWrap: { width: width - 50 },
        align: 'center'
      }).setOrigin(0.5)
      alertContainer.add(modalText)
    }

    // Botones opcionales
    const gapX = 150
    const totalButtonWidth = buttons.length * 100 + (buttons.length - 1) * gapX
    const startX = -totalButtonWidth / 2 + 50

    buttons.forEach(({ text, onClick }, index) => {
      const buttonX = startX + index * (100 + gapX)
      const buttonY = height / 2 - 50

      const buttonBackground = this.scene.add.graphics()
      buttonBackground.fillStyle(0xffffff, 1)
      buttonBackground.fillRoundedRect(buttonX - 120, buttonY - 40, 240, 50, 10)

      // Hacer el fondo del botón interactivo
      buttonBackground.setInteractive(new Phaser.Geom.Rectangle(buttonX - 120, buttonY - 40, 240, 50), Phaser.Geom.Rectangle.Contains)

      const buttonText = this.scene.add.text(buttonX, buttonY - 15, text, {
        fontSize: '24px',
        fill: '#0f0f0f'
      })
        .setOrigin(0.5)
        .setInteractive()

      // Asignar el mismo evento pointerup al fondo del botón
      buttonBackground.on('pointerup', () => {
        onClick && onClick()
        this.dismissAlert(alertContainer)
      })

      buttonText.on('pointerup', () => {
        onClick && onClick()
        this.dismissAlert(alertContainer)
      })

      alertContainer.add(buttonBackground)
      alertContainer.add(buttonText)
    })

    // Botón de aceptar
    if (btnAccept) {
      const buttonAcceptBackground = this.scene.add.graphics()
      buttonAcceptBackground.fillStyle(0xffffff, 1)
      buttonAcceptBackground.fillRoundedRect(-100, height / 2 - 90, 200, 50, 10)

      // Hacer el fondo del botón de aceptar interactivo
      buttonAcceptBackground.setInteractive(new Phaser.Geom.Rectangle(-100, height / 2 - 90, 200, 50), Phaser.Geom.Rectangle.Contains)

      const buttonAccept = this.scene.add
        .text(0, height / 2 - 65, 'Aceptar', {
          fontSize: '24px',
          fill: '#0f0f0f'
        })
        .setOrigin(0.5)
        .setInteractive()

      // Asignar el mismo evento pointerup al fondo del botón de aceptar
      buttonAcceptBackground.on('pointerup', () => this.dismissAlert(alertContainer))

      buttonAccept.on('pointerup', () => this.dismissAlert(alertContainer))

      alertContainer.add(buttonAcceptBackground)
      alertContainer.add(buttonAccept)
    }

    // Botón de cierre si es descartable
    if (dismissible) {
      const closeButton = this.scene.add
        .text(width / 2 - 30, -height / 2 + 30, '✖', {
          fontSize: '16px',
          color: '#ffffff',
          fontStyle: 'bold'
        }).setOrigin(0.5)

      closeButton.setInteractive()
      closeButton.on('pointerup', () => this.dismissAlert(alertContainer))
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
