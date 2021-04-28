'use strict'

import { app } from 'electron'
import updateApp from 'update-electron-app'
import initWindow from './services/windowManager'
import DisableButton from './config/DisableButton'
import electronDevtoolsInstaller, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { registerFileManagerService } from './file-manager'

function onAppReady() {
  initWindow()
  DisableButton.Disablef12()
  registerFileManagerService()
  if (process.env.NODE_ENV === 'development') {
    electronDevtoolsInstaller(VUEJS_DEVTOOLS)
      .then((name) => console.log(`installed: ${name}`))
      .catch(err => console.log('Unable to install `vue-devtools`: \n', err))
  }
}

app.isReady() ? onAppReady() : app.on('ready', onAppReady)

//更新app
updateApp({
  repo: 'hoxiete/electron-download',
  updateInterval: '5 minutes',
  logger: require('electron-log')
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('browser-window-created', () => {
  console.log('window-created')
})
