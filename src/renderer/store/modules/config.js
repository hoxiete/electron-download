import { setStrategy, getStrategy } from '../../utils/electronStoreUtil'
const config = {
  state: {
    strategy: [{ key: 1, name: 'javbus1', strategy: '.nthread_firstpostbox img.zoom' }, { key: 2, name: 'pickpig2', strategy: '.nthread_firstpostsdadbox img.zoo' },{ key: 3, name: 'javbus3', strategy: 'dasdasdasdsad' }, { key: 4, name: 'pickpig4', strategy: '.nthread_firstpoaaaastbox img.zoo' },{ key: 5, name: 'javbus5', strategy: '.nthread_firstpostbddddfffox img.zoom' }, { key: 6, name: 'pickpig6', strategy: '.nthrdasdaead_firstpostbox img.zoo' }],
    currentStrategy: ''
  },

  mutations: {
    ADD_STRATEGY: (state, data) => {
      let { name, strategy } = data
      data = Object.assign({ name, strategy }, { key: state.strategy.reduce((acc, curr) => acc.key > curr.key ? acc.key : curr.key) + 1 })
      state.strategy = [...state.strategy, data]
    },
    SELECT_STRATEGY: (state, data) => {
      state.currentStrategy = state.strategy.find(ele => ele.key === data.key)
    },
    EDIT_STRATEGY: (state, data) => {
      let all = state.strategy
      all.splice(all.findIndex(ele => ele.key === data.key), 1, data)
      state.strategy = all
    },
    DEL_STRATEGY: (state, data) => {
      let all = state.strategy
      all.splice(all.findIndex(ele => ele.key === data.key), 1)
      state.strategy = all
    },
  },
  actions: {
    addStrategy ({ commit, getters }, data) {
      commit('ADD_STRATEGY', data)
      setStrategy(getters.allStrategy)
    },
    selectStrategy ({ commit }, data) {
      commit('SELECT_STRATEGY', data)
    },
    editStrategy ({ commit, getters }, data) {
      commit('EDIT_STRATEGY', data)
      setStrategy(getters.allStrategy)
    },
    delStrategy ({ commit, getters }, data) {
      commit('DEL_STRATEGY', data)
      setStrategy(getters.allStrategy)
    },


  },
  // namespaced:true
}

export default config
