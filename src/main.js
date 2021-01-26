import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import ElementUI from 'element-ui'
//import './styles.scss'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css';

import "./assets/css/main.css";
import "./assets/css/color-dark.css";

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.$EventBus = new Vue()

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
