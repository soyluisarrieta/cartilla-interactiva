export function grid ({
  element,
  totalItems,
  item: { width, height },
  maxColumns,
  gap = 0,
  position = [0, 0]
}) {
  const [posX, posY] = position

  for (let i = 0; i < totalItems; i++) {
    const row = Math.floor(i / maxColumns)
    const col = i % maxColumns

    const columnsInRow = Math.min(totalItems - (row * maxColumns), maxColumns)
    const startX = totalItems >= 4
      ? (posX + ((maxColumns * (width + gap)) - (columnsInRow * (width + gap))) / 2)
      : posX

    const x = startX + col * (width + gap)
    const y = posY + row * (height + gap)

    element({ x, y }, i)
  }
}
