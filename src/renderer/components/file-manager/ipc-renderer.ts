import { ipcRenderer, IpcRendererEvent, remote } from 'electron'
import {
  SystemPath,
  IDownloadFile,
  INewDownloadFile,
  IPagination,
  IPCEventName,
} from '../../../main/file-manager/interface'

/**
 * 添加 ipc 调用监听事件
 * @param eventName - ipc 事件名
 * @param callback - 回调函数
 */
export const ipcRendererListener = (
  eventName: IPCEventName,
  callback: (event: IpcRendererEvent, ...args: any[]) => void,
): void => {
  ipcRenderer.on(eventName, (event, ...args: any[]) => {
    callback(event, ...args)
  })
}

/**
 * 调用 ipc 的处理事件
 * @param eventName - ipc 事件名
 * @param args - 参数
 * @returns `Promise<any>`
 */
export const ipcRendererInvoke = <T>(eventName: IPCEventName, ...args: any[]): Promise<T> =>
  ipcRenderer.invoke(eventName, ...args)

/**
 * 获取系统路径
 */
export const getSystemPath = (path: SystemPath): Promise<string> => ipcRendererInvoke('getSystemPath', path)

/**
 * 打开文件
 * @param path - 路径
 */
export const openFile = (path: string): Promise<string> => ipcRendererInvoke('openFile', path)

/**
 * 判断是否在下载数据
 */
export const isDownloading = (path: string): Promise<string> => ipcRendererInvoke('isDownloading', path)

/**
 * 打开下载管理器
 */
export const openDownloadManager = (): void => {
  ipcRendererInvoke('openDownloadManager', '/download-manager')
}

/**
 * 新建下载项
 * @param formData - 下载数据
 */
export const newDownloadFile = (formData: INewDownloadFile): Promise<IDownloadFile | null> =>
  ipcRendererInvoke<IDownloadFile | null>('newDownloadFile', formData)

/**
 * 重新下载
 */
export const retryDownloadFile = (item: IDownloadFile): Promise<boolean> =>
  ipcRendererInvoke<boolean>('retryDownloadFile', item)

/**
 * 打开选择保存位置对话框
 * @param path - 路径
 */
export const openFileDialog = (path: string): Promise<string> =>{
  return ipcRendererInvoke<string>('openFileDialog', path)
}
/**
 * 打开选择文件对话框
 * @param path - 路径
 */
export const chooseFileDialog = (path: string): Promise<string> =>{
  return ipcRendererInvoke<string>('chooseFileDialog', path)
}

/**
 * 从路径获取文件资源url
 * @param path - 路径
 */
export const getUrl4File = (path: string): Promise<string> =>{
  return ipcRendererInvoke<string>('getUrl4File', path)
}

/**
 * 暂停或恢复下载
 * @param item - 下载项
 */
export const pauseOrResume = (item: IDownloadFile): Promise<IDownloadFile> =>
  ipcRendererInvoke<IDownloadFile>('pauseOrResume', item)

/**
 * 打开文件所在位置
 * @param path - 路径
 */
export const openFileInFolder = (path: string): Promise<boolean> =>
  ipcRendererInvoke<boolean>('openFileInFolder', path)

/**
 * 获取下载数据
 * @param page - 分页
 */
export const getDownloadData = (page: IPagination): Promise<IDownloadFile[]> =>
  ipcRendererInvoke('getDownloadData', page)

/**
 * 删除下载项。下载中的将先取消，再删除
 * @param item - 下载项
 * @param index - 下载项的下标
 */
export const removeDownloadItem = (item: IDownloadFile, index: number): Promise<IDownloadFile> =>
  ipcRendererInvoke<IDownloadFile>('removeDownloadItem', item, index)

/**
 * 清空下载完成项
 */
export const clearDownloadDone = (): Promise<IDownloadFile[]> =>
  ipcRendererInvoke('clearDownloadDone')
/**
 * 设置上一次下载的路径
 */
export const setLastDownloadPath = (path:string): Promise<void> =>
  ipcRendererInvoke('setLastDownloadPath',path)
/**
 * 获取上一次下载的路径
 */
export const getLastDownloadPath = (): Promise<string> =>
  ipcRendererInvoke('getLastDownloadPath')

/**
 * 监听新建下载项事件
 * @param callback - 回调函数
 */
export const listenerNewDownloadItem = (
  callback: (event: IpcRendererEvent, ...args: any[]) => void,
): void => ipcRendererListener('newDownloadItem', callback)

/**
 * 监听下载项更新事件
 * @param callback - 回调函数
 */
export const listenerDownloadItemUpdate = (
  callback: (event: IpcRendererEvent, ...args: any[]) => void,
): void => ipcRendererListener('downloadItemUpdate', callback)

/**
 * 监听下载项完成事件
 * @param callback - 回调函数
 */
export const listenerDownloadItemDone = (
  callback: (event: IpcRendererEvent, ...args: any[]) => void,
): void => ipcRendererListener('downloadItemDone', callback)
