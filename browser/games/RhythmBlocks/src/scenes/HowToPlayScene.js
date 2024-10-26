export default class HowToPlayScene extends Phaser.Scene {
  constructor () {
    super({ key: 'HowToPlayScene' })

    this.currentStep = 0
    this.steps = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8'
    ]
  }

  create () {
  }
}
