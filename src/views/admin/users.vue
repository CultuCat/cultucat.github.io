<template>
  <v-col>
    <h1 style="color: #ff6961" class="my-5 ml-5">Users</h1>
    <ListOfItems :items="items" />
  </v-col>
</template>

<script setup>
import ListOfItems from "@/components/listOfItems.vue";
import {obtenerUsuarios}  from '@/assets/datos.js';
</script>

<script>
export default {
  data() {
    return {
      items: obtenerUsuarios(),
    };
  },
  methods: {
    updateAvatarUrls() {
      const baseUrl = "https://ui-avatars.com/api/?name=";
      this.items = this.items.map((user) => ({
        ...user,
        avatar: baseUrl + encodeURIComponent(user.name),
      }));
    },
  },
  components: {
    ListOfItems,
  },
  created(){
    this.updateAvatarUrls();
  }
};
</script>
