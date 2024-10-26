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
