import Vue from 'vue';
import VSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
import moment from 'moment';
import store from '../store';
import App from '../view/popup.vue';

Vue.config.productionTip = false;

Vue.component('v-select', VSelect);

moment.locale('es');
Vue.filter('toRelative', (time) => moment(time).fromNow());

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
