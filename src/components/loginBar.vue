<template>
  <v-img class="ma-5" src="../assets/full_logo.png" width="250" style="position:absolute;"></v-img>
  <v-container class="custom-fill-height">
    <v-card-text class="d-flex flex-column justify-center" :style="{ width: '80%', marginTop: '12%', maxWidth: '500px' }">
      <div class="text-h5 text-left">{{ $t('LOGIN.Entra') }}</div>
      <v-btn class="mt-5 mb-5" @click="login" :style="{ width: '100%' }">
        <img src="..\assets\google_icon.svg" alt="googlelogo" :style="{ width: '20px', height: '20px' }" />
        <span :style="{ marginLeft: '10%' }">{{ $t('LOGIN.Google') }}</span>
      </v-btn>
      <v-divider />
      <br>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field v-model="username" class="mb-2" :rules="userRules" label="Username" density="compact"
          variant="outlined"></v-text-field>
        <v-text-field v-model="password" :rules="passwordRules" :type="'password'" label="Password" density="compact"
          variant="outlined"></v-text-field>
        <v-card v-if="error" class="text-medium-emphasis text-caption mb-6" color="red" variant="tonal">
          <v-card-text class="pa-3">
            <v-icon icon="mdi-alert-circle" />
            <span class="ml-2">{{ $t('LOGIN.User_incorrecte') }}</span>
          </v-card-text>
        </v-card>
        <v-card v-else-if="block" class="text-medium-emphasis text-caption mb-6" color="red" variant="tonal">
          <v-card-text class="pa-3">
            <v-icon icon="mdi-alert-circle" />
            <span class="ml-2">{{ $t('LOGIN.Compte_bloquejat') }}</span>
          </v-card-text>
        </v-card>
        <br v-else>
        <v-btn :loading="isLoading" block color="#ff6961" type="submit" variant="elevated">
          Log In
        </v-btn>
      </v-form>
      <br>
      <router-link to="signup" :style="{ color: '#ff6961', textAlign: 'center' }">
        Sign up
      </router-link>
    </v-card-text>
  </v-container>
</template>
  
<script>
import { mapActions } from 'vuex';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import googlePassword from '../main';

export default {
  name: "loginBar",
  data() {
    return {
      userDetails: null,
      username: null,
      password: null,
      error: false,
      block: false,
      userRules: [v => !!v || $t('LOGIN.contra_obligatori')],
      passwordRules: [v => !!v || $t('LOGIN.username_obligatori')],
      isLoading: false,
    };
  },
  methods: {
    ...mapActions(['loginUser']),
    login() {
      const googleProvider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, googleProvider)
        .then((result) => {
          this.username = result.user.email.split('@')[0];
          this.password = googlePassword;
          this.onSubmit();
        }).catch((error) => {
          console.error("Error:", error);
        });
    },
    onSubmit() {
      this.isLoading = true;
      this.block = false;
      this.error = false;
      fetch("https://cultucat.hemanuelpc.es/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.token) {
            this.loginUser(data);
            window.location.pathname = "/home";
          }
          else if (data.detail.includes('bloquejat'))
            this.block = true;
          else
            this.error = true;
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
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
