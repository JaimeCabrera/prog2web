import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Axios from "axios";
import "./styles/styles.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "bootstrap/dist/css/bootstrap.css";

Vue.config.productionTip = false;
Vue.use(Axios);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
