export default class Opening {
  static imageKey = 'openingLogos'
  static duration = 1000

  constructor (scene) {
    this.phaser = scene
  }

  start ({ scene: nextScene }) {
    const { centerX, centerY } = this.phaser.cameras.main
    const logos = this.phaser.add.image(centerX, centerY, Opening.imageKey)
    const duration = Opening.duration

    this.phaser.tweens.add({
      targets: logos,
      alpha: { from: 0, to: 1 },
      scale: { from: 0.9, to: 1 },
      duration,
      ease: 'Power2',
      onComplete: () => {
        this.phaser.time.delayedCall(duration + 500, () => {
          this.fadeOut(logos, nextScene)
        })
      }
    })
  }

  fadeOut (targets, nextScene) {
    this.phaser.tweens.add({
      targets,
      alpha: 0,
      duration: Opening.duration / 3,
      ease: 'Power2',
      onComplete: () => {
        this.phaser.scene.start(nextScene)
      }
    })
  }
}
