
const download = {
  state: {
    totalSize: 0,
    percent: 0,
    currentSize: 0,
    status: null,
  },

  mutations: {
    ADD_TOTAL: (state, data) => {
      state.totalSize += data
    },
    ADD_CURRENT: (state, data) => {
      state.currentSize += data
      state.percent = Math.round((state.currentSize * 100) / state.totalSize, -1)
      if (state.currentSize == state.totalSize) {
        status = 'success'
      }
    },
    CLEAR_STATUS: (state) => {
      state.totalSize = 0
      state.percent = 0
      state.currentSize = 0
      state.status = null
    }
  },
  actions: {
    clearStatus ({ commit }) {
      commit('CLEAR_STATUS')
    },
    addTotal ({ commit }, data) {
      commit('ADD_TOTAL', data)
    },
    addCurrent ({ commit }, data) {
      commit('ADD_CURRENT', data)
    },
    setError ({ commit }) {
      commit('SET_ERROR')
    }
    
  },
  // namespaced:true
}

export default download
