<template>
  <v-img class="ma-5" src="../assets/full_logo.png" width="250" style="position:absolute;"></v-img>
  <v-container class="custom-fill-height">
    <v-card-text class="d-flex flex-column justify-center">
      <div class="text-h4 text-left">Benvingut</div>
      <div class="text-subtitle-1">Sisplau inicia sesió amb google per poder accedir</div>
      <v-btn class="ma-10" @click="login" :style="{ height: '50px' }">
        <img src="..\assets\google_icon.svg" :style="{ width: '25px', height: '25px' }" />
        <span :style="{ marginLeft: '15%' }">Continue with Google</span>
      </v-btn>
    </v-card-text>
    <router-link to="home">
      <v-btn rounded="lg" color="white" :style="{ backgroundColor: '#68ceec' }">Log in</v-btn>
    </router-link>
  </v-container>
</template>
  
<script>
import { googleSdkLoaded } from 'vue3-google-login';
import axios from 'axios';

export default {
  name: "loginBar",
  data() {
    return {
      userDetails: null,
    };
  },
  methods: {
    login() {
      googleSdkLoaded(google => {
        google.accounts.oauth2
          .initCodeClient({
            client_id:
              "948818461396-91c1v4hbv49tmdn69c0uk6298806l0aj.apps.googleusercontent.com",
            scope: "email profile openid",
            redirect_uri: "http://localhost:3000/home",
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
            redirect_uri: "https://www.google.es",
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
          console.log(response)
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
