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


import VueGoogleMaps from '@fawmi/vue-google-maps'


const app = createApp(App)
app.use(VueGoogleMaps, {
    load: {
    key: 'AIzaSyBcncMehtx6yWI0OD0oWqEbc3HTGmBYNrQ',
  },
    installComponents: true,
    //autobindAllEvents: true,
})
registerPlugins(app)

app.mount('#app')
