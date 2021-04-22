import electronStore from '../../main/data/store'

const strategy = 'strategy'
const setting = 'setting'
export function setStrategy (array) {
  electronStore.set(strategy, array)
}
export function getStrategy () {
  return electronStore.get(strategy)
}
export function setGlobalSetting (array) {
  electronStore.set(setting, array)
}
export function getGlobalSetting () { 
  return electronStore.get(setting)
}