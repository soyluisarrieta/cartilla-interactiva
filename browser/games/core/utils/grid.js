export function grid ({
  element,
  totalItems,
  item: { width = 1, height = 1 },
  scale = 1,
  maxColumns = 1,
  gap = 0,
  position = [0, 0],
  alignCenter = false
}) {
  const [posX, posY] = position
  const scaledWidth = width * scale
  const scaledHeight = height * scale

  // Cálculo del número de filas y columnas necesarios
  const rows = Math.ceil(totalItems / maxColumns)
  const columns = Math.min(totalItems, maxColumns)

  // Cálculo del tamaño total del grid
  const gridWidth = columns * (scaledWidth + gap) - gap
  const gridHeight = rows * (scaledHeight + gap) - gap

  let startX, startY

  if (alignCenter) {
    // Cálculo de la posición de inicio para centrar el grid
    startX = posX - (gridWidth / 2)
    startY = posY - (gridHeight / 2)
  } else {
    startX = posX
    startY = posY
  }

  for (let i = 0; i < totalItems; i++) {
    const row = Math.floor(i / maxColumns)
    const col = i % maxColumns

    // Calcular las posiciones X e Y para cada item
    const x = startX + col * (scaledWidth + gap)
    const y = startY + row * (scaledHeight + gap)

    // Posicionar el elemento
    element({ x, y }, i)
  }
}
