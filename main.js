import { app } from 'electron'
import { startServer } from './src/server.js'
import { createWindow } from './src/lib/electron/createWindow.js'

// Iniciar la aplicación cuando esté lista
app.whenReady().then(() => {
  startServer()
  createWindow()
})

// Manejar evento de cierre de todas las ventanas
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit() // Cerrar la aplicación si no está en macOS
})
