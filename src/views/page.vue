<template>
    <v-app-bar elevation="8" color="#ff6961" :style="{ padding: '0 4vw' }">
      <router-link to="/">
          <v-img src="../assets/logo.png" :width="64" aspect-ratio="1/1" />
      </router-link>
      <v-app-bar-title>CultuCat</v-app-bar-title>
      <router-link to="/login">
        <v-btn rounded="lg" color="white" :style="{ backgroundColor: '#68ceec' }">
          Log in
        </v-btn>
      </router-link>
    </v-app-bar>
</template>

<script>
export default {
  name: "Page",
}
</script>
