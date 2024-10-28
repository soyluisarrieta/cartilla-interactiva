import { addInteractions } from '../utils/addInteractions.js'

export default class Button {
  static soundKey = 'soundPress'

  static draw (phaser) {
    return ({
      key,
      frame,
      scene = null,
      position = [],
      disabled = false,
      withInteractions = true,
      soundKey = Button.soundKey,
      onClick = null
    }) => {
      const button = Button.createButton(phaser, key, frame, position)
      button.setDisabled = Button.setDisabled
      button.setDisabled(disabled)
      button.handleOnClick = Button.createHandleOnClick(phaser, scene, soundKey, onClick, button)

      Button.configureInteractions(button, withInteractions, key, frame)

      return button
    }
  }

  static createButton (phaser, key, frame, position) {
    const { centerX, centerY } = phaser.cameras.main
    const [x = centerX, y = centerY] = position
    return phaser.add.image(x, y, key, frame)
      .setOrigin(0.5, 0.5)
      .setInteractive()
  }

  static setDisabled (disabled = true) {
    this.disabled = disabled
    disabled ? this.removeInteractive() : this.setInteractive()
    this.setAlpha(disabled ? 0.5 : 1)
  }

  static createHandleOnClick (phaser, scene, soundKey, onClick, button) {
    return () => {
      if (button.disabled) {
        return
      }
      phaser.sound.play(soundKey)
      if (scene) {
        phaser.scene.start(scene)
      }

      if (typeof onClick === 'function') {
        onClick({ button })
      }
    }
  }

  static configureInteractions (button, withInteractions, key, frame) {
    const onClickHandler = button.handleOnClick

    if (withInteractions) {
      addInteractions({
        button,
        key,
        frame,
        onClick: onClickHandler
      })
    } else {
      button.on('pointerup', onClickHandler)
    }
  }
}
