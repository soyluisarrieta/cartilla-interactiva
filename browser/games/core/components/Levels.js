import { getProfile, setProfile } from '../../../scripts/Profile.js'
import { SCENES } from '../constants.js'
import UIAnimations from '../UIAnimations.js'
import { addInteractions } from '../utils/addInteractions.js'

export default class Levels {
  static nextScene = SCENES.INSTRUCTIONS
  static gap = 300

  constructor (scene) {
    this.scene = scene
    this.uiAnimations = new UIAnimations(scene)
  }

  init () {
    const { width } = this.scene.cameras.main
    const profile = getProfile()
    const profileLevels = profile.games[profile.playing].levels
    const currentGame = window.gameSettings
    const levels = currentGame ? currentGame.levels : currentGame.levels

    const numLevels = levels.length
    const totalWidth = numLevels * 200 + (numLevels - 1) * 100
    const startX = (width - totalWidth) / 2 + 200 / 2
    const position = [startX, 400]

    for (let index = 0; index < numLevels; index++) {
      const profileLevel = profileLevels[index]
      const level = levels[index]
      level.index = index
      level.position = index
      level.locked = Boolean(index !== 0 && profileLevels[index - 1]?.completed === undefined)
      level.status = profileLevel.completed ? '-completed' : level.locked ? '-locked' : ''
      this.draw(level, position)
      position[0] += Levels.gap
    }
  }

  draw (level, [x, y]) {
    const texture = `level-${level.name + level.status}`
    const levelButton = this.scene.add.image(x, y, 'levels', texture)
      .setOrigin(0.5, 0.5)
      .setInteractive()

    if (!level.locked) {
      addInteractions({
        button: levelButton,
        key: 'levels',
        frame: `level-${level.name + level.status}`,
        onClick: () => {
          const profile = getProfile()
          profile.selectedLevel = level.index
          setProfile(profile)
          this.scene.sound.play('soundPress')
          this.scene.scene.start(Levels.nextScene, level)
        }
      })
    }

    if (level.id === undefined) {
      level.id = level.index
    }

    this.uiAnimations.scaleUp({
      targets: levelButton,
      duration: 300,
      delay: level.index * 100
    })
  }
}
