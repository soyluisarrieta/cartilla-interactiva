import { PORT, SRC_FOLDER } from '../../constants.js'
import { BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'

// Función para crear una nueva ventana del navegador
export function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 800,
    minHeight: 400,
    frame: false,
    resizable: true,
    icon: join(SRC_FOLDER, '..', 'build', 'favicon-256x256.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      preload: join(SRC_FOLDER, 'preload.js'),
      partition: `persist:${PORT}`
    }
  })

  // Cargar el archivo index.html en la nueva ventana
  mainWindow.loadFile(join(SRC_FOLDER, 'admin', 'index.html'))

  // Window buttons
  ipcMain.on('closeApp', () => { mainWindow.close() })
  ipcMain.on('minimizeApp', () => { mainWindow.minimize() })
  ipcMain.on('maximizeRestoreApp', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
      mainWindow.webContents.send('isRestored')
    } else {
      mainWindow.maximize()
      mainWindow.webContents.send('isMaximized')
    }
  })
}
