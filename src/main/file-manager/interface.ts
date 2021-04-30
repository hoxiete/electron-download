import { DownloadItem, WebContents } from 'electron'

export type DownloadItemState = 'progressing' | 'completed' | 'cancelled' | 'interrupted'

export type IPCEventName =
  | 'openDownloadManager'
  | 'getDownloadData'
  | 'newDownloadFile'
  | 'retryDownloadFile'
  | 'openFileDialog'
  | 'chooseFileDialog'
  | 'getUrl4File'
  | 'getSystemPath'
  | 'openFile'
  | 'isDownloading'
  | 'openFileInFolder'
  | 'initDownloadItem'
  | 'pauseOrResume'
  | 'removeDownloadItem'
  | 'clearDownloadDone'
  | 'newDownloadItem'
  | 'downloadItemUpdate'
  | 'downloadItemDone'
  | 'setLastDownloadPath'
  | 'getLastDownloadPath'

export type SystemPath = 'home'
  | 'appData'
  | 'userData'
  | 'cache'
  | 'temp'
  | 'exe'
  | 'module'
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos'
  | 'recent'
  | 'logs'
  | 'pepperFlashSystemPlugin'
  | 'crashDumps'
  
export interface INewDownloadFile {
  url: string
  fileName?: string
  path: string
}

export interface IDownloadFile {
  id: string
  url: string
  icon: string
  fileName: string
  path: string
  state: DownloadItemState
  startTime: number
  speed: number
  progress: number
  totalBytes: number
  receivedBytes: number
  paused: boolean
  _sourceItem: DownloadItem | undefined
}

export interface IDownloadBytes {
  receivedBytes: number
  totalBytes: number
}

export interface IPagination {
  pageIndex: number
  pageCount: number
}

export interface IAddDownloadItem {
  item: DownloadItem
  downloadIds: string[]
  data: IDownloadFile[]
  newSingleDownloadItem: INewDownloadFile | null
}

export interface IUpdateDownloadItem {
  item: DownloadItem
  data: IDownloadFile[]
  downloadItem: IDownloadFile
  prevReceivedBytes: number
  state: DownloadItemState
}

export interface GlogalSetting {
  backgroudUrl: string,
  savePath: string,
  themeColor: string,
  firstCloseApp: boolean,
  hideOrQuit: boolean
}

