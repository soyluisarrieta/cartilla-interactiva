import { addInteractions } from '../../assets/utils/addInteractions.js'

export default class Button {
  static soundKey = 'soundPress'

  constructor (scene) {
    this.phaser = scene
  }

  static draw ({
    key,
    frame,
    scene = null,
    position: { x, y },
    withInteractions = true,
    soundKey = Button.soundKey,
    onClick = null
  }) {
    const button = this.phaser.add.image(x, y, frame, key)
      .setOrigin(0.5, 0.5)
      .setInteractive()

    const handleEvent = () => this.handleOnClick(scene, soundKey, onClick)

    if (withInteractions) {
      addInteractions({
        button,
        key: frame,
        frame: key,
        onClick: handleEvent()
      })
    } else {
      button.on('pointerup', handleEvent())
    }

    return button
  }

  handleOnClick (scene, soundKey, onClick) {
    this.phaser.sound.play(soundKey)
    if (scene) {
      this.phaser.scene.start(scene)
    }

    // Manejador del onClick
    if (typeof onClick === 'function') {
      onClick()
    }
  }
}
