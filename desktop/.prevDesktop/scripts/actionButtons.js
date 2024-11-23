const { ipcRenderer } = require('electron')

export function actionButtons ({ minimizeId, maxResId, closeId }) {
  const minimizeBtn = document.getElementById(minimizeId)
  const maxResBtn = document.getElementById(maxResId)
  const closeBtn = document.getElementById(closeId)

  // Fn: Cambiar title del botón de maximizar/restaurar
  const changeMaxResBtn = (isMaximizedApp) => {
    maxResBtn.title = isMaximizedApp ? 'Restaurar' : 'Maximizar'
  }

  // Event listeners para los botones
  maxResBtn.addEventListener('click', () => { ipcRenderer.send('maximizeRestoreApp') })
  minimizeBtn.addEventListener('click', () => { ipcRenderer.send('minimizeApp') })
  closeBtn.addEventListener('click', () => { ipcRenderer.send('closeApp') })

  // Eventos del renderer
  ipcRenderer.on('isMaximized', () => { changeMaxResBtn(true) })
  ipcRenderer.on('isRestored', () => { changeMaxResBtn(false) })
}
