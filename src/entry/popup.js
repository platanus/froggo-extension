import Vue from 'vue';
import store from '../store';
import App from '../view/popup.vue';

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
