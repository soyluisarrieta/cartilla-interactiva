import Button from '../../../core/components/Button.js'
import { BUTTONS, FONTS, SCENES } from '../../../core/constants.js'
import { addInteractions } from '../../../core/utils/addInteractions.js'
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

    this.add.text(width / 2, 120, 'Selecciona un modo', {
      fontSize: '48px',
      fontFamily: FONTS.PRIMARY,
      color: '#ffffff'
    }).setOrigin(0.5)

    // Crear niveles
    const modes = this.game.levels.length === 2 ? ['auditive', 'visual'] : ['write', 'listen', 'read']
    modes.forEach((mode, modeIndex) => {
      const offset = this.game.levels.length === 2 ? 150 : 0
      const modeButton = this.add
        .image(width / 2 + (modeIndex - 1) * 300 + offset, 400, 'modes', `mode-${mode}`)
        .setInteractive()
        .on('pointerup', () => {
          const level = {
            index: modeIndex,
            notes: this.game.notes,
            ...this.game.levels[modeIndex]
          }

          // Cantidad de notas aleatorias
          if (this.game?.notes?.groups) {
            this.showNoteGroupSelection(level, this.game?.notes?.groups)
            return null
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

          // Notas específicas
          this.scene.start(SCENES.GAME, level)
        })

      addInteractions({
        button: modeButton,
        key: 'modes',
        frame: `mode-${mode}`
      })
    })
  }

  // Seleccionar grupo de notas
  showNoteGroupSelection (level, noteGroups) {
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

    this.add.text(width / 2, 120, 'Selecciona una cantidad', {
      fontSize: '48px',
      fontFamily: FONTS.PRIMARY,
      color: '#ffffff'
    }).setOrigin(0.5)

    // Crear botones para cada grupo de notas
    grid({
      totalItems: noteGroups.length,
      maxColumns: 2,
      item: { width: 400, height: 100 },
      gap: 70,
      alignCenter: true,
      position: [width / 1.94, 600],
      element: ({ x, y }, i) => {
        const groupSize = noteGroups[i]
        const notes = this.game.notes.get(groupSize)
        const onClick = () => {
          level.name = `${level.name} (${groupSize} notas)`
          level.notes = notes
          this.scene.start(SCENES.GAME, level)
        }

        this.add
          .image(x, y, 'itemBanner2')
          .setScale(0.25)
          .setOrigin(0, 0.5)
          .setFlipX(true)
          .setInteractive()
          .on('pointerup', onClick)

        this.add.text(x + 40, y, `${groupSize} notas`, {
          fontSize: '40px',
          fontFamily: FONTS.SECONDARY,
          color: '#ffffff'
        }).setOrigin(0, 0.5)
          .setInteractive()
          .on('pointerup', onClick)
      }
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

    this.add.text(width / 2, 120, 'Selecciona un modo', {
      fontSize: '48px',
      fontFamily: FONTS.PRIMARY,
      color: '#ffffff'
    }).setOrigin(0.5)

    const contrasts = ['high', 'low']
    contrasts.forEach((contrast, i) => {
      const modeButton = this.add.image(
        width / (i ? 1.7 : 2.3),
        400,
        'modes',
        `mode-notes-${contrast}`
      )
        .setInteractive()
        .on('pointerup', () => {
          const translation = i ? 'Bajas' : 'Altas'
          level.name = `${level.name} (${translation})`
          level.notes = level.notes[contrast + 's']
          this.scene.start(SCENES.GAME, level)
        })

      addInteractions({
        button: modeButton,
        key: 'modes',
        frame: `mode-notes-${contrast}`
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

    this.add.text(width / 2, 120, 'Selecciona una escala', {
      fontSize: '48px',
      fontFamily: FONTS.PRIMARY,
      color: '#ffffff'
    }).setOrigin(0.5)

    const scales = this.game.scales
    grid({
      totalItems: scales.length,
      maxColumns: 2,
      item: { width: 500, height: 100 },
      gap: scales.length > 10 ? 0 : 100,
      alignCenter: true,
      position: [width / 1.94, 600],
      element: ({ x, y }, i) => {
        const scale = scales[i]
        const level = {
          ...selectedLevel,
          name: `${selectedLevel.name} (${scale.name})`,
          notes: scale.notes
        }
        const onClick = () => this.scene.start(SCENES.GAME, level)

        this.add
          .image(x, y, 'itemBanner3')
          .setScale(0.25)
          .setOrigin(0, 0.5)
          .setFlipX(true)
          .setInteractive()
          .on('pointerup', onClick)

        this.add.text(x + 40, y, scale.name, {
          fontSize: '40px',
          fontFamily: FONTS.SECONDARY,
          color: '#ffffff'
        }).setOrigin(0, 0.5)
          .setInteractive()
          .on('pointerup', onClick)
      }
    })
  }
}
