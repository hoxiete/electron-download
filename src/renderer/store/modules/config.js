import { setStrategy, getStrategy, setGlobalSetting, getGlobalSetting } from '../../utils/electronStoreUtil'
const config = {
  state: {
    strategy: [{ key: 1, name: 'javbus', strategy: '.nthread_firstpostbox img.zoom' }],
    currentStrategy: '',
    openSettingFlag: false,
    //当前全局设置 从 electronStore里拿，如果没有则采用默认配置
    globalSetting: getGlobalSetting() || {
      backgroudUrl: '',
      savePath: '',
      themeColor: 'rgb(248, 9, 109)'
    },
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
    OPEN_SETTING: (state) => {
      state.openSettingFlag = true
    },
    CLOSE_SETTING: (state) => {
      state.openSettingFlag = false
    },
    VIEW_CHANGE_BG: (state, data) => {
      state.globalSetting.backgroudUrl = data
    },
    VIEW_CHANGE_THEME: (state, data) => {
      state.globalSetting.themeColor = data
    },
    CHANGE_SAVEPATH: (state, data) => {
      state.globalSetting.savePath = data
    },
    SAVE_GLOGAL_SETTING: (state, data) => {
      state.globalSetting = data
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
    openGlogalSetting ({ commit }) {
      commit('OPEN_SETTING')
    },
    closeGlogalSetting ({ commit }) {
      commit('CLOSE_SETTING')
    },
    viewChangeBG ({ commit, getters }, data) {
      commit('VIEW_CHANGE_BG', data)
    },
    viewChangeTheme ({ commit, getters }, data) {
      commit('VIEW_CHANGE_THEME', data)
    },
    changeSavePath ({ commit, getters }, data) {
      commit('CHANGE_SAVEPATH', data)
    },
    saveGlobalSetting ({ commit, getters }, data) {
      commit('SAVE_GLOGAL_SETTING', data)
    },




  },
  // namespaced:true
}

export default config
