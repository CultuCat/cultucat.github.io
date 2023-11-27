<template>
  <template v-if="items != null">
  <v-col>
    <h1 style="color: #ff6961" class="my-5 ml-5">Users</h1>
    <ListOfItems :type="'list_users'" view="admin_users" />
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
},
mounted() {
  axios
    .get("https://cultucat.hemanuelpc.es/users/")
    .then((response) => {
      if (response.status === 200) {
        this.items = response.data;
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