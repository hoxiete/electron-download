/**
 * 在这里则是state.文件名.状态名
 */
const getters = {
  percent: state => state.download.percent,
  status: state => state.download.status,
  allStrategy: state => state.config.strategy,
  currentStrategy: state => state.config.currentStrategy,
  openSettingFlag: state => state.config.openSettingFlag,
  globalSetting: state => state.config.globalSetting,
  backgroudUrl: state => state.config.globalSetting.backgroudUrl,
  themeColor: state => state.config.globalSetting.themeColor,


}
export default getters
