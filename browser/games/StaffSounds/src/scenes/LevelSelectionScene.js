import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'

export default class LevelSelectionScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.LEVEL_SELECTION })
  }

  create () {
    const { width, height } = this.cameras.main
    this.game = window.gameSettings

    // Imagen de fondo
    this.add.image(0, 0, 'bgMenu')
      .setOrigin(0)
      .setDisplaySize(width, height)

    // Botón: Ir atrás
    Button.draw(this)({
      ...BUTTONS.BACK,
      scene: SCENES.MENU,
      position: [150, 120]
    })

    // Título
    this.add.image(width / 2, 120, 'bannerTitle')
      .setOrigin(0.5)

    this.add.bitmapText(width / 2, 120, FONTS.PRIMARY, 'Selecciona un modo')
      .setOrigin(0.5)

    // Crear niveles
    const modes = ['easy', 'medium', 'hard']
    modes.forEach((mode, modeIndex) => {
      this.add.image(width / 2 + (modeIndex - 1) * 300, 400, 'levels', `level-${mode}`)
        .setInteractive()
        .on('pointerup', () => {
          const level = {
            index: modeIndex,
            notes: this.game.notes,
            ...this.game.levels[modeIndex]
          }
          if (level.notes.highs || level.notes.lows) {
            this.showLevelSelection(level)
          } else {
            this.scene.start(SCENES.GAME, level)
          }
        })
    })
  }

  showLevelSelection (level) {
    const { width, height } = this.cameras.main

    // Limpiar la escena antes de mostrar los niveles
    this.children.removeAll()

    // Imagen de fondo
    this.add.image(0, 0, 'bgMenu')
      .setOrigin(0)
      .setDisplaySize(width, height)

    // Botón: Ir atrás
    Button.draw(this)({
      ...BUTTONS.BACK,
      scene: SCENES.LEVEL_SELECTION,
      position: [150, 120]
    })

    // Título
    this.add.image(width / 2, 120, 'bannerTitle')
      .setOrigin(0.5)

    this.add.bitmapText(width / 2, 120, FONTS.PRIMARY, 'Selecciona un modo')
      .setOrigin(0.5)

    const contrasts = ['highs', 'lows']
    contrasts.forEach((contrast, i) => {
      this.add.image(
        width / (i ? 1.7 : 2.3),
        400,
        'levels',
        `level-${level.name.toLowerCase()}-${contrast}`
      )
        .setInteractive()
        .on('pointerup', () => {
          const translation = i ? 'Bajas' : 'Altas'
          level.name = `${level.name} (${translation})`
          level.notes = level.notes[contrast]
          this.scene.start(SCENES.GAME, level)
        })
    })
  }
}
