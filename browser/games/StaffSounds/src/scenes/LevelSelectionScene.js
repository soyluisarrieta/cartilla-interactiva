import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'

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

          // Escalas musicales
          if (this.game.scales) {
            this.showScalesSelection(level)
            return null
          }

          // Notas altas/bajas
          if (level.notes.highs || level.notes.lows) {
            this.showLevelSelection(level)
            return null
          }

          // Notas especificas
          this.scene.start(SCENES.GAME, level)
        })
    })
  }

  // Seleccionar nivel de notas altas/bajas
  showLevelSelection (level) {
    const { width, height } = this.cameras.main
    this.children.removeAll()

    // Imagen de fondo
    this.add
      .image(0, 0, 'bgMenu')
      .setOrigin(0)
      .setDisplaySize(width, height)

    // Botón: Ir atrás
    Button.draw(this)({
      ...BUTTONS.BACK,
      scene: SCENES.LEVEL_SELECTION,
      position: [150, 120]
    })

    // Título
    this.add
      .image(width / 2, 120, 'bannerTitle')
      .setOrigin(0.5)

    this.add
      .bitmapText(width / 2, 120, FONTS.PRIMARY, 'Selecciona un modo')
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

  // Mostrar escalas musicales
  showScalesSelection (selectedLevel) {
    const { width, height } = this.cameras.main
    this.children.removeAll()

    // Imagen de fondo
    this.add
      .image(0, 0, 'bgMenu')
      .setOrigin(0)
      .setDisplaySize(width, height)

    // Botón: Ir atrás
    Button.draw(this)({
      ...BUTTONS.BACK,
      scene: SCENES.LEVEL_SELECTION,
      position: [150, 120]
    })

    // Título
    this.add
      .image(width / 2, 120, 'bannerTitle')
      .setOrigin(0.5)

    this.add
      .bitmapText(width / 2, 120, FONTS.PRIMARY, 'Selecciona una escala')
      .setOrigin(0.5)

    const scales = this.game.scales
    grid({
      totalItems: scales.length,
      maxColumns: 2,
      item: { width: 700, height: 100 },
      gap: 100,
      alignCenter: true,
      position: [width / 1.75, 600],
      element: ({ x, y }, i) => {
        const scale = scales[i]
        const level = {
          ...selectedLevel,
          name: `${selectedLevel.name} (Escala ${scale.name})`,
          notes: scale.notes
        }
        const onClick = () => this.scene.start(SCENES.GAME, level)

        Button.draw(this)({
          ...BUTTONS.ARROW_RIGHT,
          position: [x, y],
          onClick
        }).setScale(0.4)

        this.add
          .bitmapText(x + 70, y, FONTS.PRIMARY, scale.name, 70)
          .setOrigin(0, 0.5)
          .setInteractive()
          .on('pointerup', onClick)
      }
    })
  }
}
