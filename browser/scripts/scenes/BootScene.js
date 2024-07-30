class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('logos', '/assets/games/resources/logos.png')
  }

  create () {
    // Crear el logo en el centro de la pantalla
    const logo = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'logos')

    // Ajustar el tamaño del logo para que se adapte al canvas
    const canvasWidth = this.cameras.main.width
    const canvasHeight = this.cameras.main.height

    // Calcular el tamaño máximo para mantener el aspecto del logo
    const logoAspectRatio = logo.displayWidth / logo.displayHeight
    const canvasAspectRatio = canvasWidth / canvasHeight

    if (logoAspectRatio > canvasAspectRatio) {
      logo.setDisplaySize(canvasWidth * 0.8, canvasWidth * 0.8 / logoAspectRatio)
    } else {
      logo.setDisplaySize(canvasHeight * 0.4 * logoAspectRatio, canvasHeight * 0.4)
    }

    // Realizar el fade-in y escala, luego el fade-out y escala
    this.tweens.add({
      targets: logo,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.9, to: 1 },
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        this.time.delayedCall(1500, () => {
          this.tweens.add({
            targets: logo,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
              this.scene.start('MenuScene')
            }
          })
        })
      }
    })
  }
}

export default BootScene
