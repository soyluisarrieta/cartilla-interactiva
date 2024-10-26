import { addInteractions } from '../utils/addInteractions.js'

export default class Button {
  static soundKey = 'soundPress'

  static draw (phaser) {
    return ({
      key,
      frame,
      scene = null,
      position = [],
      withInteractions = true,
      soundKey = Button.soundKey,
      onClick = null
    }) => {
      const { centerX, centerY } = phaser.cameras.main
      const [x = centerX, y = centerY] = position
      const button = phaser.add.image(x, y, key, frame)
        .setOrigin(0.5, 0.5)
        .setInteractive()

      // Manejar el evento onClick
      const handleOnClick = () => {
        phaser.sound.play(soundKey)
        if (scene) {
          phaser.scene.start(scene)
        }

        if (typeof onClick === 'function') {
          onClick()
        }
      }

      // Manejar texturas
      if (withInteractions) {
        addInteractions({
          button,
          key,
          frame,
          onClick: handleOnClick
        })
      } else {
        button.on('pointerup', handleOnClick)
      }

      return button
    }
  }
}
