<template>
  <v-col>
    <h1 style="color: #ff6961" class="my-5 ml-5">Users</h1>
    <ListOfItems :type="'list_users'" />
  </v-col>
</template>

<script setup>
import ListOfItems from "@/components/listOfItems.vue";
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
        imatge: baseUrl + encodeURIComponent(user.name),
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
