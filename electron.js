import { app, BrowserWindow, protocol, shell, ipcMain } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
])

function setupAppProtocol() {
  protocol.registerFileProtocol('app', (request, callback) => {
    try {
      const url = new URL(request.url)
      const pathname = decodeURIComponent(url.pathname)
      const filePath = path.join(__dirname, 'dist', pathname)
      callback({ path: filePath })
    } catch (error) {
      callback({ error: -6 })
    }
  })
}

function createWindow() {

  const devServerUrl = process.env.VITE_DEV_SERVER_URL
  const iconPath = devServerUrl ? path.join(__dirname, 'public', 'chaos.ico') : path.join(__dirname, 'dist', 'chaos.ico')

  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1200,
    minHeight: 600,
    autoHideMenuBar: true,
    icon: iconPath,
    webPreferences: {
      plugins:true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: false,
    },
  });


  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      if (url.startsWith('app://')) {
        const u = new URL(url)
        const rel = decodeURIComponent(u.pathname).replace(/^\/+/, '')
        const absolute = path.join(__dirname, 'dist', rel)
        shell.openExternal(`file://${absolute}`)
      } else {
        shell.openExternal(url)
      }
    } catch (e) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })


  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl)
  } else {
    mainWindow.loadURL('app://./index.html')
  }
}

app.whenReady().then(() => {
  setupAppProtocol()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
