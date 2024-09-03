import { addInteractions, mergeObjects } from '/scripts/Utils.js'

class LevelSelectionScene extends Phaser.Scene {
  constructor () {
    super({ key: 'LevelSelectionScene' })

    // Configuración predeterminada
    this.config = {
      background: 'background',
      title: {
        frame: 'bg-title',
        image: 'uiLvlSelection',
        imagePositionY: 50,
        text: 'Selecciona un nivel',
        fontFamily: 'primaryFont',
        textPositionY: 65
      },
      levels: {
        name: ['Nivel 1'],
        image: 'uiLvlSelection',
        images: [],
        frame: 'btn-arrow',
        width: 200,
        gap: 100,
        textScale: 0.5,
        fontFamily: 'primaryFont',
        buttonScale: 2,
        positionY: 400
      },
      homeButtonY: 230
    }
  }

  init (data) {
    this.config = mergeObjects(this.config, data)
  }

  create () {
    const { width: widthScreen, height: heightScreen } = this.cameras.main
    const {
      background,
      title,
      levels,
      homeButtonY
    } = this.config

    const numLevels = levels.name.length

    // Imagen de fondo
    this.add.image(0, 0, background)
      .setOrigin(0)
      .setDisplaySize(widthScreen, heightScreen)

    // Título
    this.add.image(widthScreen / 2, title.imagePositionY, title.image, title.frame)
      .setScale(1.5)
      .setOrigin(0.5, 0)

    this.add.bitmapText(widthScreen / 2, title.textPositionY, title.fontFamily, title.text)
      .setOrigin(0.5, 0)

    // Niveles
    const totalWidth = numLevels * levels.width + (numLevels - 1) * levels.gap
    const startX = (widthScreen - totalWidth) / 2 + levels.width / 2

    const position = { x: startX, y: levels.positionY }

    for (let i = 0; i < numLevels; i++) {
      const levelButton = this.add.image(position.x, position.y, levels.image, levels.frame)
        .setScale(levels.buttonScale)
        .setOrigin(0.5, 0.5)
        .setInteractive()

      this.add.bitmapText(position.x, position.y + 120, levels.fontFamily, levels.name[i])
        .setOrigin(0.5, 0.5)
        .setScale(levels.textScale)

      addInteractions({
        button: levelButton,
        key: levels.image,
        frame: levels.frame,
        onClick: () => {
          this.scene.start('InstructionsScene', { level: i + 1 })
        }
      })

      position.x += levels.width + levels.gap
    }

    // Botón de inicio
    const btnHome = this.add.image(widthScreen / 2, heightScreen - homeButtonY, 'uiLvlSelection', 'btn-home')
      .setScale(1.5)
      .setOrigin(0.5)
      .setInteractive()

    addInteractions({
      button: btnHome,
      key: 'uiLvlSelection',
      frame: 'btn-home',
      onClick: () => {
        this.scene.start('MenuScene')
      }
    })
  }
}

export default LevelSelectionScene
