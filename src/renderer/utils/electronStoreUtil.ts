import electronStore from '../../main/data/store'
import { GlogalSetting } from '../../main/file-manager/interface'

const strategy: string = 'strategy'
const setting: string = 'setting'
export function setStrategy(array: Array<string>) {
  electronStore.set(strategy, array)
}
export function getStrategy() {
  return electronStore.get(strategy)
}
export function setGlobalSetting(obj: GlogalSetting) {
  electronStore.set(setting, obj)
}
export function getGlobalSetting(): GlogalSetting {
  return electronStore.get(setting)
}

export function getsetting() {
  return electronStore
}