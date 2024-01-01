<template>
  <template v-if="items != null">
    <v-col>
      <h1 style="color: #ff6961" class="my-5 ml-5">Users</h1>
      <ListOfItems :items="items" :type="'list_users'" view="admin_users" />
    </v-col>
  </template>
</template>

<script>
import ListOfItems from "@/components/listOfItems.vue";
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      items: null,
    };
  },
  computed: {
    ...mapGetters(['user']),
  },
  mounted() {
    fetch("https://cultucat.hemanuelpc.es/users/")
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al obtener el perfil del usuario");
        }
      })
      .then(data => {
        console.log(data);
        this.items = data.filter(item => {
          console.log(item.id);
          return item.id !== this.user.user.id;
        });
        console.log(this.items);
      })
      .catch(error => {
        console.error("Error al obtener el perfil del usuario:", error);
      });
  },
  components: {
    ListOfItems,
  },
};
</script>