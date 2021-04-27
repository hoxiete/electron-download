// store的字段数据以及store的默认值
import {GlogalSetting} from '../../file-manager/interface'
import {Schema} from 'electron-store'
var schema = {
  setting: {
    type: 'object',
    default: {
      backgroudUrl: '',
      savePath: '',
      themeColor: 'rgb(248, 9, 109)',
      firstCloseApp: true,
      hideOrQuit: true
    } as GlogalSetting,
  } 
} as Schema<Object>


export default schema