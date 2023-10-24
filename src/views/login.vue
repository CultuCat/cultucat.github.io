<template>
  <v-row>
    <v-col class="pb-0" v-if="windowWidth > 960">
      <v-img height="100vh" cover src="../assets/login.jpg"></v-img>
    </v-col>
    <v-col class="pb-0">
      <loginBar />
    </v-col>
  </v-row>
</template>


<script>
import loginBar from "@/components/loginBar.vue";

export default {
  name: "Login",
  components: {
    loginBar
  },
  data() {
    return {
      windowWidth: window.innerWidth
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  }
}
</script>
