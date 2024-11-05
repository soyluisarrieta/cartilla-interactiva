import { BUTTONS } from '../../../core/constants.js'

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
      .image(x, y, BUTTONS.HOME.key, BUTTONS.HOME.frame)
      .setScale(0.3)
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
    const texture = isActived ? BUTTONS.HOME : BUTTONS.LISTEN_MELODY
    const scale = isActived ? 0.4 : 0.3
    this.resetAll()
    interval
      .setTexture(texture.key, texture.frame)
      .setScale(scale)
    return interval
  }

  // Reiniciar texturas
  resetAll () {
    this.all.forEach(interval => {
      interval
        .setTexture(BUTTONS.HOME.key, BUTTONS.HOME.frame)
        .setScale(0.3)
    })
  }
}
