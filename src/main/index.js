'use strict'

import { app, BrowserWindow, Menu } from 'electron'
const path = require('path')
const ipcMain = require('electron').ipcMain

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
let showDevTools = true
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
  showDevTools = false
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : path.join('file://', __dirname, '/index.html')

if (process.platform === 'darwin') {
  const template = [
    {
      label: 'Application',
      submenu: [
        { label: 'Quit', accelerator: 'Command+Q', click: function () { app.quit() } }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' }
      ]
    }
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
} else {
  Menu.setApplicationMenu(null)
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    width: 1440,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    acceptFirstMouse: true,
    titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: showDevTools,
      webviewTag: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('focus', (event) => {
    event.sender.send('focus')
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('window-min', function () {
  mainWindow.minimize()
})

// 接收最大化命令
ipcMain.on('window-max', function () {
  if (mainWindow.isMaximized()) {
    mainWindow.restore()
  } else {
    mainWindow.maximize()
  }
})

// 接收关闭命令
ipcMain.on('window-close', function () {
  mainWindow.close()
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
