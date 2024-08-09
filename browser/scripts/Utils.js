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

export function mergeObjects (baseObject, updates) {
  const mergedObject = { ...baseObject }

  for (const key of Object.keys(updates)) {
    if (typeof updates[key] === 'object' && !Array.isArray(updates[key]) && updates[key] !== null) {
      mergedObject[key] = {
        ...mergedObject[key],
        ...updates[key]
      }
    } else {
      mergedObject[key] = updates[key]
    }
  }

  return mergedObject
}
