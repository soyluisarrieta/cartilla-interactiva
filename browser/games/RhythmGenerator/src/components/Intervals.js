export default class Intervals {
  constructor (scene) {
    this.scene = scene
  }

  // Inicialización
  init () {
    this.selected = null
    this.all = []
  }

  // Implementación
  draw (position = [0, 0]) {
    const [x, y] = position
    const interval = this.scene.add
      .image(x, y, 'intervalIndicator', 'interval-off')
      .setScale(0.8)
      .setOrigin(0.5)

    interval.actived = false
    this.all.push(interval)
    return interval
  }

  // Seleccionar un intervalo
  select (intervalIndex) {
    this.selected = this.all[intervalIndex]
    return this
  }

  // Cambiar textura
  setTexture ({ key, frame }) {
    this.selected.setTexture(key, frame)
  }

  // Activar/Desactivar estado
  setActived (isActived, interval = this.selected) {
    const frame = isActived ? 'interval-on' : 'interval-off'
    const scale = isActived ? 0.9 : 0.8
    this.resetAll()
    interval
      .setTexture('intervalIndicator', frame)
      .setScale(scale)
    return interval
  }

  // Reiniciar texturas
  resetAll () {
    this.all.forEach(interval => {
      interval
        .setTexture('intervalIndicator', 'interval-off')
        .setScale(0.8)
    })
  }
}
