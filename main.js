import { app } from 'electron'
import { startServer } from './src/server.js'
import { createWindow } from './src/lib/electron/createWindow.js'

const gotTheLock = app.requestSingleInstanceLock()

// Verificar si ya está ejecutada la app
if (!gotTheLock) {
  app.quit()
} else {
  // Manejar la primera instancia de la aplicación
  app.whenReady().then(() => {
    startServer()
    createWindow()
  })

  // Manejar evento de cierre de todas las ventanas
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit() // Cerrar la aplicación si no está en macOS
  })
}
