import Vue from 'vue'

import App from './App'
import store from './store'
import SvgIcon from '@/components/SvgIcon'// svg组件
// 引用element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './components/file-manager/download/style.module.less'

Vue.config.productionTip = false

Vue.prototype.$download = require('./utils/StreamDownload').default
Vue.prototype.$ipcApi = require('./utils/ipcRenderer').default

Vue.component('svg-icon', SvgIcon)
Vue.use(ElementUI)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/icons/svg', false, /\.svg$/)
requireAll(req)
/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
