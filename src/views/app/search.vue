<template>
    <template v-if="items != null">
    <v-col>
      <h1 style="color: #ff6961" class="my-5 ml-5">Search Users</h1>
      <ListOfItems :items="items" />
  </v-col>
  </template>
</template>

<script setup>
import ListOfItems from "@/components/listOfItems.vue";
import axios from "axios";
</script>

<script>
export default {
  data() {
    return {
      items: null,
    };
  },
  methods: {
    updateAvatarUrls() {
      const baseUrl = "https://ui-avatars.com/api/?name=";
      this.items = this.items.map((user) => ({
        ...user,
        imatge: baseUrl + encodeURIComponent(user.first_name),
      }));
    },
  },
  mounted() {
    axios
      .get("https://cultucat.hemanuelpc.es/users/")
      .then((response) => {
        if (response.status === 200) {
          this.items = response.data;
          this.updateAvatarUrls();
        }
      })
      .catch((error) => {
        // Maneja errores aquí
        console.error("Error al obtener el perfil del usuario:", error);
      });
  },
  components: {
    ListOfItems,
  },
};
</script>
