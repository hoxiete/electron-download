import Vue from 'vue'

import App from './App'
import store from './store'
// 引用element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false

Vue.prototype.$download = require('./utils/StreamDownload').default

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  components: { App },
  store,
  template: '<App/>'
}).$mount('#app')
