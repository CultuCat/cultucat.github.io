/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import VueGoogleMaps from '@fawmi/vue-google-maps';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDK9GBHygfr7NI6ZtWy_fSSzQxY3LoWyMg",
  authDomain: "pes-cultucat.firebaseapp.com",
  projectId: "pes-cultucat",
  storageBucket: "pes-cultucat.appspot.com",
  messagingSenderId: "605730650277",
  appId: "1:605730650277:web:fdb90b860fa362429cf54c",
  measurementId: "G-7BTEFZEYED"
};

export default "$W4#yLz2*QsFv@6uG8hJ1pA5nDx@9oP3r";

const appf = initializeApp(firebaseConfig);
getAnalytics(appf);
const app = createApp(App)
app.use(VueGoogleMaps, {
    load: {
    key: 'AIzaSyBcncMehtx6yWI0OD0oWqEbc3HTGmBYNrQ',
    libraries: 'places',
  },
    installComponents: true,
    //autobindAllEvents: true,
})
registerPlugins(app)

app.mount('#app')
