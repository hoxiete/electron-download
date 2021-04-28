import { app, BrowserWindow, Menu, Tray, dialog } from 'electron'
import menuconfig from '../config/menu'
import config from '@config'
import setIpc from './ipcMain'
import upload from './checkupdate'
import { isDownloading } from '../file-manager/download/index'
import path from 'path'
import { electron } from 'process'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
// 这个瓜皮全局变量只能在单个js中生效，而并不是整个主进程中
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}
// 将文件地址挪到这里
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT}` : `file://${__dirname}/index.html`
const loadingURL = process.env.NODE_ENV === 'development' ? `http://localhost:${process.env.PORT}/static/loader.html` : `file://${__static}/loader.html`
var loadWindow = null
var mainWindow = null
var appTray = null;


function createMainWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 622,
    useContentSize: true,
    width: 1233,
    minWidth: 1200,
    show: false,
    minimizable: true,
    maximizable: true,
    titleBarStyle: 'hidden',
    frame: false,
    icon: __dirname + 'build/icons/icon.ico',
    // frame: config.IsUseSysTitle,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      // 如果是开发模式可以使用devTools
      devTools: process.env.NODE_ENV === 'development',
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === 'darwin'
    }
  })
  // 这里设置只有开发环境才注入显示开发者模式
  if (process.env.NODE_ENV === 'development') {
    menuconfig.push({
      label: '开发者设置',
      submenu: [{
        label: '切换到开发者模式',
        accelerator: 'F12',
        role: 'toggledevtools'
      }]
    })
  }
  // 载入菜单
  // const menu = Menu.buildFromTemplate(menuconfig)
  // Menu.setApplicationMenu(menu)
  Menu.setApplicationMenu(null)
  mainWindow.loadURL(winURL)

  setIpc.Mainfunc(mainWindow)  //没用
  upload.Update(mainWindow)
  // DownloadUpdate.download(mainWindow) //下载功能有了 不需要

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.show()
  })
  if (config.UseStartupChart) loadWindow.destroy()

  if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools(true)

  /***
   * 关闭窗口前提示确认信息
   */
  mainWindow.on('close', async (e) => {
    e.preventDefault(); //先阻止一下默认行为，不然直接关了，提示框只会闪一下
    let flag = await isDownloading();
    if (flag) {
      dialog.showMessageBox(mainWindow,{
        type: 'none',
        title: '消息',
        icon: 'build/icons/icon.ico',
        cancelId: 2,
        defaultId: 0,
        message: '当前任务还在下载就退出吗？',
        buttons: ['是的', '再想想']
      }).then(result => {
        if (result.response == 0) {
          mainWindow = null;
          app.quit()
        }
      })
    } else {
      app.quit();
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.platform === 'win32') {
    //设置托盘图标和菜单
    var trayMenuTemplate = [
      {
        label: '打开',
        click: () => {
          mainWindow.show();
        }
      },
      {
        label: '退出',
        click: () => {
          // app.quit();
          mainWindow.close()
          // app.quit();//因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
        }
      }
    ];
    //系统托盘图标
    appTray = process.env.NODE_ENV === 'development' ? new Tray('build/icons/icon.ico') : new Tray(`${__dirname}/static/icon.ico`);
    //图标的上下文菜单
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    //设置此托盘图标的悬停提示内容
    appTray.setToolTip('lsp-download');
    //设置此图标的上下文菜单
    appTray.setContextMenu(contextMenu);
    //单击右下角小图标显示应用左键
    appTray.on('click', function () {
      mainWindow.show();
    })
    //右键
    appTray.on('right-click', () => {
      appTray.popUpContextMenu(trayMenuTemplate);
    });
  };
}

function loadingWindow() {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    backgroundColor: '#222',
    transparent: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: { experimentalFeatures: true }
  })

  loadWindow.loadURL(loadingURL)

  loadWindow.show()

  setTimeout(() => {
    createMainWindow()
  }, 2000)

  loadWindow.on('closed', () => {
    loadWindow = null
  })
}

function initWindow() {
  if (config.UseStartupChart) {
    return loadingWindow()
  } else {
    return createMainWindow()
  }
}
export { mainWindow as win }
export default initWindow
