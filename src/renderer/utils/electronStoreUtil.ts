import electronStore from '../../main/data/store'
import { GlogalSetting } from '../../main/file-manager/interface'

const strategy: string = 'strategy'
const setting: any = 'setting'
const firstCloseApp: string = 'firstCloseApp'
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
  return electronStore.get(setting) as GlogalSetting
}
export function restoreGlobalSetting(): GlogalSetting {
  electronStore.reset(setting)
  return getGlobalSetting() 
}
export function setFirstClose() {
  electronStore.set(setting, false)
}
export function getFirstClose(): boolean {
  return electronStore.get(firstCloseApp) as boolean
}

export function getsetting() {
  return electronStore
}