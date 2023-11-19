/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import router from '../router'
import vuex from './vuex'
import axios from './axios';

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(vuex)
    .use(axios);
}
