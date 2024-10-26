export function getFiguresFromLevels (levels) {
  const figures = new Set()
  levels.forEach(level => {
    level.figures.forEach(figure => {
      figures.add(figure.name)
    })
  })
  return Array.from(figures)
}
