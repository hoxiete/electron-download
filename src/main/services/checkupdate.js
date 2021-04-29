import { autoUpdater } from 'electron-updater'
import {app, ipcMain } from 'electron'
import log from 'electron-log'
/**
 * -1 检查更新失败 0 正在检查更新 1 检测到新版本，准备下载 2 未检测到新版本 3 下载中 4 下载完成
 **/
function Message (mainWindow, type, data) {
  const senddata = {
    state: type,
    msg: data
  }
  mainWindow.webContents.send('UpdateMsg', senddata)
}

export default {
  Update (mainWindow) {
    // 设置地址要和package中的一样
    // let updateHost = 'https://hazel-weld.vercel.app'
    // let url =`${updateHost}/update/${process.platform}/${app.getVersion()}`
    // autoUpdater.setFeedURL(url)

    // 当更新发生错误的时候触发。
    autoUpdater.on('error', (err) => {
      debugger
      log.log('更新出现错误')
      log.log(err.message)
      if (err.message.includes('sha512 checksum mismatch')) {
        Message(mainWindow, -1, 'sha512校验失败')
      }
    })

    // 当开始检查更新的时候触发
    autoUpdater.on('checking-for-update', (event, arg) => {
      debugger
      log.log('开始检查更新')
      Message(mainWindow, 0)
    })

    // 发现可更新数据时
    autoUpdater.on('update-available', (event, arg) => {
      log.log('有更新')
      Message(mainWindow, 1)
    })

    // 没有可更新数据时
    autoUpdater.on('update-not-available', (event, arg) => {
      log.log('没有更新')
      Message(mainWindow, 2)
    })

    // 下载监听
    autoUpdater.on('download-progress', (ProgressInfo) => {
    //   ProgressInfo {
    //     total: number;
    //     delta: number;
    //     transferred: number;
    //     percent: number;
    //     bytesPerSecond: number;
    // }
      Message(mainWindow, 3, ProgressInfo)
    })

    // 下载完成
    autoUpdater.on('update-downloaded', () => {
      log.log('下载完成')
      Message(mainWindow, 4)
    })
    // 执行自动更新检查
    ipcMain.on('check-update', () => {
      autoUpdater.checkForUpdates().catch(err => {
        log.log('网络连接问题', err)
      })
    })
    // 渲染进程执行更新操作
    ipcMain.on('confirm-update', () => {
      log.log('退出并更新')
      autoUpdater.quitAndInstall()
    })
    ipcMain.handle('get-appversion',(e,args)=> {
      // if (process.env.NODE_ENV === 'development'){
        return require("../../../package.json").version
      // }else{
      //   return require("./package.json").version
      // }
    }
      )
  }
}
