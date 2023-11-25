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
    };
  },
  components: {
    ListOfItems,
  },
};
</script>
