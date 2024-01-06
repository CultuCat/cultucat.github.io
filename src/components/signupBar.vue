<template>
  <v-img class="ma-5" src="../assets/full_logo.png" width="250" style="position:absolute;"></v-img>
  <v-container class="custom-fill-height">
    <v-card-text class="d-flex flex-column justify-center" :style="{ width: '80%', marginTop: '15%', maxWidth: '500px' }">
      <div class="text-h5 text-left">{{ $t('LOGIN.Registrat') }}</div>
      <v-btn class="mt-5 mb-5" @click="signup" :style="{ width: '100%' }">
        <img src="..\assets\google_icon.svg" alt="googlelogo" :style="{ width: '20px', height: '20px' }" />
        <span :style="{ marginLeft: '10%' }">{{ $t('LOGIN.Google') }}</span>
      </v-btn>
      <v-divider />
      <br>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field v-model="name" class="mb-2" :rules="nameRules" label="Name" density="compact"
          variant="outlined"></v-text-field>
        <v-text-field v-model="username" class="mb-2" :rules="userRules" label="Username" density="compact"
          variant="outlined"></v-text-field>
        <v-text-field v-model="email" class="mb-2" :rules="emailRules" label="Email" density="compact"
          variant="outlined"></v-text-field>
        <v-text-field v-model="password" class="mb-2" :rules="passwordRules" :type="'password'" label="Password"
          density="compact" variant="outlined"></v-text-field>
        <v-text-field v-model="password2" :rules="passwordRules" :type="'password'" label="Repeat Password"
          density="compact" variant="outlined"></v-text-field>

        <v-card v-if="usernameError" class="text-medium-emphasis text-caption mb-6" color="red" variant="tonal">
          <v-card-text class="pa-3">
            <v-icon icon="mdi-alert-circle" />
            <span class="ml-2">{{ $t('LOGIN.user_existeix') }}</span>
          </v-card-text>
        </v-card>
        <v-card v-else-if="emailError" class="text-medium-emphasis text-caption mb-6" color="red" variant="tonal">
          <v-card-text class="pa-3">
            <v-icon icon="mdi-alert-circle" />
            <span class="ml-2">{{ $t('LOGIN.email_existeix') }}</span>
          </v-card-text>
        </v-card>
        <v-card v-else-if="passwordError" class="text-medium-emphasis text-caption mb-6" color="red" variant="tonal">
          <v-card-text class="pa-3">
            <v-icon icon="mdi-alert-circle" />
            <span class="ml-2">{{ $t('LOGIN.contra_igual') }}</span>
          </v-card-text>
        </v-card>
        <br v-else>
        <v-btn :loading="isLoading" block color="#ff6961" type="submit" variant="elevated">
          Sign up
        </v-btn>
      </v-form>
      <br>
      <router-link to="login" :style="{ color: '#ff6961', textAlign: 'center' }">
        Log in
      </router-link>
    </v-card-text>
  </v-container>
</template>
  
<script>
import { mapActions } from 'vuex';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import googlePassword from '../main';

export default {
  name: "signupBar",
  data() {
    return {
      userDetails: null,
      name: null,
      username: null,
      email: null,
      password: null,
      password2: null,
      image: null,
      emailRules: [
        v => !!v || this.$t('LOGIN.email_obligatori'),
        v => /^(\S+@\S+\.\S+){1,5}$/.test(v) || this.$t('LOGIN.format_email'),
      ],
      nameRules: [v => !!v || this.$t('LOGIN.nom_obligatori')],
      userRules: [v => !!v || this.$t('LOGIN.username_obligatori')],
      passwordRules: [
        v => !!v || this.$t('LOGIN.contra_obligatori'),
        v => (v && v.length >= 8) || this.$t('LOGIN.contra_min'),
        v => /[0-9]/.test(v) || this.$t('LOGIN.contra_num'),
        v => /[A-Z]/.test(v) || this.$t('LOGIN.contra_mayuscula'),
        v => /[a-z]/.test(v) || this.$t('LOGIN.contra_minuscula'),
        v => /[!@#$%^&*(),.?":{}|<>+-]/.test(v) || this.$t('LOGIN.contra_especial')
      ],
      usernameError: false,
      emailError: false,
      passwordError: false,
      googleUser: false,
      isLoading: false,
    };
  },
  methods: {
    ...mapActions(['loginUser']),
    signup() {
      const googleProvider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, googleProvider)
        .then((result) => {
          this.name = result.user.displayName;
          this.username = result.user.email.split('@')[0];
          this.email = result.user.email;
          this.password = googlePassword;
          this.password2 = googlePassword;
          this.googleUser = true;
          this.image = result.user.photoURL;
          this.onSubmit();
        }).catch((error) => {
          console.error("Error:", error);
        });
    },
    onSubmit() {
      this.isLoading = true;
      this.usernameError = false;
      this.emailError = false;
      if (this.password != this.password2) {
        this.passwordError = true;
      } else {
        this.passwordError = false;
        fetch("https://cultucat.hemanuelpc.es/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: this.name,
            username: this.username,
            email: this.email,
            password: this.password,
            isGoogleUser: this.googleUser,
            imatge_url: this.image,
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
            else if (data.username) {
              this.usernameError = true;
            }
            else {
              this.emailError = true;
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
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
