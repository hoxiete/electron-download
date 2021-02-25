import {ipcRenderer} from 'electron'

export default {
  send(data, arg, cb) {
    ipcRenderer.send(data, arg)
  },
  on(data, arg, cb) {
    ipcRenderer.on(data, arg)
  },
  remove(data) {
    ipcRenderer.removeAllListeners(data)
  }
}
