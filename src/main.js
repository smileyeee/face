import Vue from 'vue'
import App from './App.vue'

// 完整引入elementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

// 路由
import VueRouter from 'vue-router'
import router from './router';
Vue.use(VueRouter)

// axios
import axios from 'axios';
Vue.use(axios)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
