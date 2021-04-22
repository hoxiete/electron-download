import { setStrategy, getStrategy } from '../../utils/electronStoreUtil'
const config = {
  state: {
    strategy: [{ key: 1, name: 'javbus', strategy: '.nthread_firstpostbox img.zoom' }],
    currentStrategy: '',
    openSettingFlag:false
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
    OPEN_SETTING:(state)=>{
      state.openSettingFlag = true
    },
    CLOSE_SETTING:(state)=>{
      state.openSettingFlag = false
    }
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
    openGlogalSetting({ commit }){
      commit('OPEN_SETTING')
    }, 
    closeGlogalSetting({ commit }){
      commit('CLOSE_SETTING')
    }


  },
  // namespaced:true
}

export default config
