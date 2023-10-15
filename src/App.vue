<template>
  <v-app>
    <template v-if="layout">
      <app-bar></app-bar>
    </template>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './layouts/AppBar.vue';
export default {
    name: "App",
    components: { AppBar },
    data: () => ({
    //
    }),
    computed: {
        layout() {
            return !(this.$route.path.includes("login") || this.$route.path === '/');
        }
    },
}
</script>
