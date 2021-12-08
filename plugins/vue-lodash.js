import Vue from 'vue'
import VueLodash from 'vue-lodash'
import _debounce from 'lodash/debounce'
 
Vue.use(VueLodash, { lodash: { _debounce } })
