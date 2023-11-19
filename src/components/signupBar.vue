<template>
  <v-img class="ma-5" src="../assets/full_logo.png" width="250" style="position:absolute;"></v-img>
  <v-container class="custom-fill-height">
    <v-card-text class="d-flex flex-column justify-center" :style="{ width: '80%', marginTop: '15%', maxWidth: '500px' }">
      <div class="text-h5 text-left">Registra't</div>
      <v-btn class="mt-5 mb-5" @click="login" :style="{ width: '100%' }">
        <img src="..\assets\google_icon.svg" alt="googlelogo" :style="{ width: '20px', height: '20px' }" />
        <span :style="{ marginLeft: '10%' }">Continue with Google</span>
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
        <v-text-field v-model="password2" :rules="passwordRulesRules" :type="'password'" label="Repeat Password"
          density="compact" variant="outlined"></v-text-field>

        <v-card v-if="usernameError" class="text-medium-emphasis text-caption mb-6" color="red" variant="tonal">
          <v-card-text class="pa-3">
            <v-icon icon="mdi-alert-circle" />
            <span class="ml-2">Ja existeix una usuari amb aquest username</span>
          </v-card-text>
        </v-card>
        <v-card v-else-if="emailError" class="text-medium-emphasis text-caption mb-6" color="red" variant="tonal">
          <v-card-text class="pa-3">
            <v-icon icon="mdi-alert-circle" />
            <span class="ml-2">Ja existeix una usuari amb aquest email</span>
          </v-card-text>
        </v-card>
        <v-card v-else-if="passwordError" class="text-medium-emphasis text-caption mb-6" color="red" variant="tonal">
          <v-card-text class="pa-3">
            <v-icon icon="mdi-alert-circle" />
            <span class="ml-2">Les contrasenyes no són iguals</span>
          </v-card-text>
        </v-card>
        <br v-else>

        <v-btn block color="#ff6961" type="submit" variant="elevated">
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
import { googleSdkLoaded } from 'vue3-google-login';
import axios from 'axios';
import { mapActions } from 'vuex';

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
      emailRules: [
        v => !!v || 'El correo electrónico es obligatorio',
        v => /.+@.+\..+/.test(v) || 'El formato del correo electrónico no es válido',
      ],
      nameRules: [v => !!v || 'El nombre es obligatorio'],
      userRules: [v => !!v || 'El username es obligatorio'],
      passwordRules: [v => !!v || 'La contraseña es obligatoria'],
      usernameError: false,
      emailError: false,
      passwordError: false,
    };
  },
  methods: {
    ...mapActions(['loginUser']),
    login() {
      googleSdkLoaded(google => {
        google.accounts.oauth2
          .initCodeClient({
            client_id:
              "948818461396-91c1v4hbv49tmdn69c0uk6298806l0aj.apps.googleusercontent.com",
            scope: "email profile openid",
            redirect_uri: "https://cultucat.netlify.app/home",
            callback: response => {
              if (response.code) {
                console.log(response.code);
                this.sendCodeToBackend(response.code);
              }
            }
          })
          .requestCode();
      });
    },
    async sendCodeToBackend(code) {
      try {
        const response = await axios.post(
          "https://oauth2.googleapis.com/token",
          {
            code: code,
            client_id:
              "948818461396-91c1v4hbv49tmdn69c0uk6298806l0aj.apps.googleusercontent.com",
            client_secret: "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",
            redirect_uri: "https://cultucat.netlify.app/home",
            grant_type: "authorization_code",
          }
        );
        // const params = new URLSearchParams();
        // params.append("code", code);
        // params.append("client_id", "948818461396-91c1v4hbv49tmdn69c0uk6298806l0aj.apps.googleusercontent.com");
        // params.append("client_secret", "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");
        // params.append("redirect_uri", "http://localhost:3000/home");
        // params.append("grant_type", "authorization_code");

        // const response = await fetch("https://oauth2.googleapis.com/token", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/x-www-form-urlencoded",
        //   },
        //   body: params,
        // });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData);
        } else {
          const data = await response.json();
          console.log("Data:", data);
        }

        const accessToken = response.access_token;
        console.log(accessToken);


        // const user = await fetch("127.0.0.1:3000", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: accessToken,
        // });

        // const data = await response.json();
        // Redirect to the homepage ("/")
        //this.$router.push("/rex");
      } catch (error) {
        console.error("Token exchange failed:", error.response.data);
      }
    },
    onSubmit() {
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
