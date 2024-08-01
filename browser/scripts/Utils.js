export function addInteractions ({ button, key, frame, onClick }) {
  // Textura Normal
  button.on('pointerout', () => {
    button.setTexture(key, frame)
  })

  // Textura Hover
  button.on('pointerover', () => {
    button.setTexture(key, frame + '-hovered')
  })

  // Textura Pressed
  button.on('pointerdown', () => {
    button.setTexture(key, frame + '-pressed')
  })

  // Redirección
  button.on('pointerup', () => {
    button.setTexture(key, frame)
    if (onClick) { onClick() }
  })
}
