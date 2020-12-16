
import App from './App.vue'
import router from './router'
import Vue from 'vue'

Vue.config.productionTip = false


// Vue实例来作为事件总线
// 再利用Vue实例 发送 事件和 监听 事件
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
