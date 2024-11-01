export function calculateElapsedTime (startTime) {
  const endTime = Date.now()
  const elapsedTimeInSeconds = (endTime - startTime) / 1000 // Tiempo en segundos
  return parseFloat(elapsedTimeInSeconds.toFixed(2))
}
