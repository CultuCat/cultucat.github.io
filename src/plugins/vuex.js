// plugins/vuex.js
import store from '@/store';

export default {
  install: (app) => {
    app.config.globalProperties.$store = store;
  },
};
