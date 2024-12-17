import { DEV_MODE, PORT, SRC_FOLDER } from '../../constants.js'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { getLocalIpAddress } from '../../utils/getLocalIpAddress.js'

// Función para crear una nueva ventana del navegador
export async function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 800,
    minHeight: 400,
    frame: false,
    resizable: true,
    icon: join(SRC_FOLDER, '..', 'browser', 'assets', 'images', 'favicons', 'web-app-manifest-256x256.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    }
  })

  if (DEV_MODE) {
    mainWindow.loadURL('http://localhost:5173/')
  } else {
    mainWindow.loadFile(join(SRC_FOLDER, '..', 'dist-desktop', 'index.html'))
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

  // Proporcionar ip del servidor
  const localUrl = `${getLocalIpAddress()}:${PORT}`
  ipcMain.handle('getIP', () => localUrl)

  // Abrir cartilla con el botón
  ipcMain.on('openIP', () => {
    shell.openExternal(`http://${localUrl}`)
  })

  // Manejar el evento cuando otra instancia intente abrirse
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
