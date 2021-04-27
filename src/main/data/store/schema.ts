// store的字段数据以及store的默认值

var schema = {
  setting: {
    type: 'object',
    default: {
      backgroudUrl: '',
      savePath: '',
      themeColor: 'rgb(248, 9, 109)',
      firstCloseApp: true,
      hideOrQuit: true
    },
  }
} as any


export default schema