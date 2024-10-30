export function grid ({
  element,
  totalItems,
  item: { width = 1, height = 1 },
  scale = 1,
  maxColumns,
  gap = 0,
  position = [0, 0]
}) {
  const [posX, posY] = position
  const scaledWidth = width * scale
  const scaledHeight = height * scale

  for (let i = 0; i < totalItems; i++) {
    const row = Math.floor(i / maxColumns)
    const col = i % maxColumns

    const columnsInRow = Math.min(totalItems - (row * maxColumns), maxColumns)
    const startX = totalItems >= 4
      ? (posX + ((maxColumns * (scaledWidth + gap)) - (columnsInRow * (scaledWidth + gap))) / 2)
      : posX

    const x = startX + col * (scaledWidth + gap)
    const y = posY + row * (scaledHeight + gap)

    element({ x, y }, i)
  }
}
