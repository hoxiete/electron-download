// store的字段数据以及store的默认值
import { GlogalSetting, defalutSetting } from '../../file-manager/interface'
import { Schema } from 'electron-store'
const schema = {
  setting: {
    type: 'object',
    default: {
      backgroudUrl: '',
      savePath: '',
      themeColor: 'rgb(248, 9, 109)',
      hideOrQuit: true
    } as GlogalSetting
  },
  firstCloseApp: true,
} as Schema<defalutSetting>


export default schema