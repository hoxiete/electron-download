/**
 * 在这里则是state.文件名.状态名
 */
const getters = {
  percent: state => state.download.percent,
  status: state => state.download.status,

}
export default getters
