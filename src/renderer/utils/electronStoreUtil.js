import electronStore from '../../main/data/store'

const strategy = 'strategy'
export function setStrategy (array) {
  electronStore.set(strategy, array)
}
export function getStrategy () {
  electronStore.get(strategy)
}