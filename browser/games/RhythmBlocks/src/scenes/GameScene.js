import { getProfile } from '../../../../scripts/Profile.js'
import Button from '../../../core/components/Button.js'
import { SCENES, BUTTONS, FONTS } from '../../../core/constants.js'
import { grid } from '../../../core/utils/grid.js'
import { UI } from '../constants.js'

export default class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: SCENES.GAME })

    this.slots = []
    this.blocks = []
  }

  init () {
    const selectedLevel = 0
    const profile = getProfile()
    this.game = profile.playing
    this.level = profile.playing.levels[selectedLevel]
  }

  create () {
    const { width } = this.cameras.main

    // Botón: Ir atrás
    Button.draw(this)({
      ...BUTTONS.BACK,
      scene: SCENES.MENU,
      position: [150, 120]
    })

    // Título
    this.add
      .bitmapText(width / 2, 100, FONTS.PRIMARY, 'GAME SCENE')
      .setOrigin(0.5, 0)

    // UI
    this.drawBlocks()
    this.drawSlots()
  }

  // Blocks
  drawBlocks () {
    const totalBlocks = this.level.metrics.blocks

    grid({
      totalItems: totalBlocks,
      item: { width: 340, height: 200 },
      maxColumns: 3,
      gap: 40,
      position: [170, 250],
      element: ({ x, y }) => {
        const block = this.add
          .image(x, y, UI.BLOCKS.KEY, UI.BLOCKS.BLOCK(2))
          .setScale(0.6)
          .setOrigin(0)
          .setInteractive({ draggable: true })

        // Propiedades iniciales del bloque
        block.initialX = x
        block.initialY = y
        block.currentSlot = null

        // Evento de arrastrar
        block.on('dragstart', () => {
          block.setTint(0xff0000)
          if (block.currentSlot) {
            // Desocupar slot en el que se encontraba
            if (block.currentSlot.occupied !== undefined && block.currentSlot.currentBlock !== undefined) {
              block.currentSlot.occupied = false
              block.currentSlot.currentBlock = null
            }
          }
        })

        // Evento para mover el bloque
        block.on('drag', (pointer, dragX, dragY) => {
          block.x = dragX
          block.y = dragY
        })

        // Evento para soltar
        block.on('dragend', (pointer) => {
          block.clearTint()

          const droppedInSlot = this.slots.find(slot => {
            return Phaser.Geom.Rectangle.ContainsPoint(slot.getBounds(), pointer)
          })

          // Función para mover el bloque con animación
          const moveBlock = (block, x, y, onComplete = () => {}) => {
            this.tweens.add({
              targets: block,
              x,
              y,
              duration: 500,
              ease: 'Power2',
              onComplete
            })
          }

          if (droppedInSlot) {
            if (droppedInSlot.occupied) {
              const occupyingBlock = droppedInSlot.currentBlock

              if (block.currentSlot) {
                // Intercambiar bloques a sus slots
                const previousSlot = block.currentSlot

                if (previousSlot.occupied !== undefined && previousSlot.currentBlock !== undefined) {
                  previousSlot.occupied = false
                  previousSlot.currentBlock = null
                }

                block.currentSlot = droppedInSlot
                occupyingBlock.currentSlot = previousSlot

                previousSlot.currentBlock = occupyingBlock
                previousSlot.occupied = true

                droppedInSlot.currentBlock = block
                droppedInSlot.occupied = true

                moveBlock(block, droppedInSlot.x + (droppedInSlot.width * droppedInSlot.scaleX / 2) - (block.width * block.scaleX / 2),
                  droppedInSlot.y - (droppedInSlot.height * droppedInSlot.scaleY / 2) - (block.height * block.scaleY / 2))

                moveBlock(occupyingBlock, previousSlot.x + (previousSlot.width * previousSlot.scaleX / 2) - (occupyingBlock.width * occupyingBlock.scaleX / 2),
                  previousSlot.y - (previousSlot.height * previousSlot.scaleY / 2) - (occupyingBlock.height * occupyingBlock.scaleY / 2))
              } else {
                // Reemplazar bloque y devolver el otro a su posición inicial
                moveBlock(occupyingBlock, occupyingBlock.initialX, occupyingBlock.initialY, () => {
                  occupyingBlock.currentSlot = null
                  if (occupyingBlock.initialSlot) {
                    occupyingBlock.initialSlot.occupied = false
                  }
                })

                block.currentSlot = droppedInSlot
                droppedInSlot.currentBlock = block
                droppedInSlot.occupied = true

                moveBlock(block, droppedInSlot.x + (droppedInSlot.width * droppedInSlot.scaleX / 2) - (block.width * block.scaleX / 2),
                  droppedInSlot.y - (droppedInSlot.height * droppedInSlot.scaleY / 2) - (block.height * block.scaleY / 2))
              }
            } else {
              // Ubicar bloque en slot vacío
              moveBlock(block, droppedInSlot.x + (droppedInSlot.width * droppedInSlot.scaleX / 2) - (block.width * block.scaleX / 2),
                droppedInSlot.y - (droppedInSlot.height * droppedInSlot.scaleX / 2) - (block.height * block.scaleY / 2))
              droppedInSlot.occupied = true
              droppedInSlot.currentBlock = block
              block.currentSlot = droppedInSlot
            }
          } else {
            moveBlock(block, block.initialX, block.initialY)
          }
        })

        this.blocks.push(block)
      }
    })
  }

  // Slots
  drawSlots () {
    const { height } = this.cameras.main
    const totalSlots = this.level.metrics.slots

    grid({
      totalItems: totalSlots,
      item: { width: 400, height: 200 },
      maxColumns: 4,
      gap: 40,
      position: [90, height - 50],
      element: ({ x, y }) => {
        const slot = this.add
          .image(x, y, UI.BLOCKS.KEY, UI.BLOCKS.SLOT(2))
          .setScale(0.7)
          .setOrigin(0, 1)

        // Propiedades iniciales del slot
        slot.occupied = false
        slot.currentBlock = null

        this.slots.push(slot)
      }
    })
  }
}
