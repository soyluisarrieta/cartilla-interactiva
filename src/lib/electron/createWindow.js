import { DEV_MODE, SRC_FOLDER } from '../../constants.js'
import { BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'

// Función para crear una nueva ventana del navegador
export async function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 800,
    minHeight: 400,
    frame: false,
    resizable: true,
    icon: join(SRC_FOLDER, '..', 'browser', 'assets', 'images', 'favicons', 'web-app-manifest-512x512.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      preload: join(SRC_FOLDER, 'lib', 'electron', 'preload.mjs')
    }
  })

  if (DEV_MODE) {
    mainWindow.loadURL('http://localhost:5173/')
  } else {
    mainWindow.loadFile(join(SRC_FOLDER, '..', 'desktop', 'dist', 'index.html'))
  }

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
