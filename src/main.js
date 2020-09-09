import Vue from "vue"
import App from "./App.vue"
import router from "./router"
import ElementUI from "element-ui"
import commonMethods from "./assets/commonMethods"
import "element-ui/lib/theme-chalk/index.css"
Vue.use(ElementUI)
Vue.use(commonMethods)
Vue.config.productionTip = false

new Vue({
	router,
	render: (h) => h(App),
}).$mount("#app")
