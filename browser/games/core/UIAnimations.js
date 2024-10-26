export default class UIAnimations {
  constructor (scene) {
    this.phaser = scene
  }

  // Helper para targets en array
  ensureArray (targets) {
    return Array.isArray(targets) ? targets : [targets]
  }

  // Fade in animation
  fadeIn ({ targets, duration = 400, delay = 100, endAlpha = 1, ...props }) {
    const elements = this.ensureArray(targets)
    elements.forEach(element => { element.alpha = 0 })
    this.phaser.tweens.add({
      targets: elements,
      alpha: { from: 0, to: endAlpha },
      duration,
      delay,
      ...props
    })
  }

  // Fade out animation
  fadeOut ({ targets, duration = 400, delay = 100, ...props }) {
    const elements = this.ensureArray(targets)
    elements.forEach(element => { element.alpha = 0 })
    this.phaser.tweens.add({
      targets: elements,
      alpha: { from: 1, to: 0 },
      duration,
      delay,
      ...props
    })
  }

  // Slide in from left
  slideInFromLeft ({ targets, duration = 400, delay = 100, endAlpha = 1, ...props }) {
    const elements = this.ensureArray(targets)
    elements.forEach(element => { element.alpha = 0; element.x -= 300 })
    this.phaser.tweens.add({
      targets: elements,
      x: { from: '-=0', to: '+=300' },
      alpha: { from: 0, to: endAlpha },
      duration,
      delay,
      ease: 'Power2',
      ...props
    })
  }

  // Slide in from right
  slideInFromRight ({ targets, duration = 400, delay = 100, endAlpha = 1, ...props }) {
    const elements = this.ensureArray(targets)
    elements.forEach(element => { element.alpha = 0; element.x += 300 })
    this.phaser.tweens.add({
      targets: elements,
      x: { from: '+=0', to: '-=300' },
      alpha: { from: 0, to: endAlpha },
      duration,
      delay,
      ease: 'Power2',
      ...props
    })
  }

  // Slide in from top
  slideInFromTop ({ targets, duration = 400, delay = 100, endAlpha = 1, ...props }) {
    const elements = this.ensureArray(targets)
    elements.forEach(element => { element.alpha = 0; element.y -= 300 })
    this.phaser.tweens.add({
      targets: elements,
      y: { from: '-=0', to: '+=300' },
      alpha: { from: 0, to: endAlpha },
      duration,
      delay,
      ease: 'Power2',
      ...props
    })
  }

  // Slide in from bottom
  slideInFromBottom ({ targets, duration = 400, delay = 100, endAlpha = 1, ...props }) {
    const elements = this.ensureArray(targets)
    elements.forEach(element => { element.alpha = 0; element.y += 300 })
    this.phaser.tweens.add({
      targets: elements,
      y: { from: '+=0', to: '-=300' },
      alpha: { from: 0, to: endAlpha },
      duration,
      delay,
      ease: 'Power2',
      ...props
    })
  }

  // Scale up animation
  scaleUp ({ targets, duration = 400, delay = 100, endScale = 1, endAlpha = 1, ...props }) {
    const elements = this.ensureArray(targets)
    elements.forEach(element => element.setScale(0))
    this.phaser.tweens.add({
      targets: elements,
      scaleX: endScale,
      scaleY: endScale,
      alpha: { from: 0, to: endAlpha },
      duration,
      delay,
      ease: 'Back.easeOut',
      ...props
    })
  }

  // Scale down animation
  scaleDown ({ targets, duration = 400, delay = 100, startScale = 1, ...props }) {
    const elements = this.ensureArray(targets)
    elements.forEach(element => element.setScale(startScale))
    this.phaser.tweens.add({
      targets: elements,
      scaleX: 0,
      scaleY: 0,
      alpha: { from: startScale, to: 0 },
      duration,
      delay,
      ease: 'Back.easeIn',
      ...props
    })
  }
}
