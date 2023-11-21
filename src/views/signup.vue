<template>
  <v-row>
    <v-col class="pb-0" v-if="windowWidth > 960">
      <v-img height="130vh" cover src="../assets/login.jpg"></v-img>
    </v-col>
    <v-col class="pb-0">
      <SignupBar/>
    </v-col>
  </v-row>
</template>


<script>
import SignupBar from "@/components/signupBar.vue";

export default {
  name: "Signup",
  components: {
    SignupBar
},
  data() {
    return {
      windowWidth: window.innerWidth,
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  }
}
</script>
