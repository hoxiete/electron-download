import { ipcRenderer } from 'electron'

export default {
  send(eventName, arg) {
    ipcRenderer.send(eventName, arg)
  },
  on(eventName, arg) {
    ipcRenderer.on(eventName, arg)
  },
  //retrun promise
  invoke(eventName, arg, cb) {
    cb === undefined ? ipcRenderer.invoke(eventName).then(arg) : ipcRenderer.invoke(eventName, arg).then(cb)
  },
  remove(eventName) {
    ipcRenderer.removeAllListeners(eventName)
  }
}
