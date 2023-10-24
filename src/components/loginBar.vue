<template>
  <v-img class="ma-5" src="../assets/full_logo.png" width="250" style="position:absolute;"></v-img>
  <v-container class="custom-fill-height">
    <v-card-text class="d-flex flex-column justify-center">
      <div class="text-h4 text-left">Benvingut</div>
      <div class="text-subtitle-1">Sisplau inicia sesió amb google per poder accedir</div>
      <!-- <v-btn class="pa-0 ma-16 text-none" height="39.4px" width="216.2px">
      </v-btn> -->
      <v-btn @click="login">Login Using Google</v-btn>
    </v-card-text>
    <router-link to="home">
      <v-btn rounded="lg" color="white" :style="{ backgroundColor: '#68ceec' }">Log in</v-btn>
    </router-link>
  </v-container>
</template>
  
<script>
export default {
  name: "loginBar",
  components: {
  },
};
</script>
  
<style lang="scss" scoped>
.subtitle {
  color: $terciary;
}

.custom-fill-height {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
