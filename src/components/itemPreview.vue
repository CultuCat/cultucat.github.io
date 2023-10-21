<template>
  <v-card v-if="item.startDate" class="my-2 mx-3" elevation="6">
    <v-card-title @click="method" class="clickable">
      <v-btn
        icon="mdi-chevron-right"
        variant="plain"
        :ripple="false"
        class="pb-1"
      ></v-btn>
      <strong>{{ item.name }}</strong>
      <p v-if="item.startDate" class="dates">
          <template v-if="item.startDate != item.endDate">
            ({{ item.startDate }} - {{ item.endDate }})
          </template>
          <template v-else> ({{ item.startDate }}) </template>
      </p>

      <v-divider></v-divider>
    </v-card-title>
    <v-card-text class="mx-8">
      {{ item.description }}
      <br /><br /><strong>Price: {{ item.price }}.</strong>
    </v-card-text>
  </v-card>

  <v-card v-else class="my-2 mx-3" elevation="4" rounded="xl">
    <v-card-item @click="method" class="clickable" append-icon="mdi-chevron-right">
      <v-avatar :image="item.avatar" size="50" class="ml-2 mr-5 my-2"></v-avatar>
      <strong>{{ item.name }}</strong>
    </v-card-item>
  </v-card>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    method() {
      console.log("clicked");
    },
    extractPrice(priceString) {
      const regex = /(\d+)\s*€/;
      const match = priceString.match(regex);

      if (match) {
        // Si se encontró un número, devolverlo como un número entero
        return parseInt(match[1], 10);
      } else if (priceString.trim().toLowerCase() === "free") {
        // Si no se encontró un número y el precio es "Free", devolver 0 para indicar que es gratuito
        return 0;
      } else {
        // Si no se encontró un número y no es "Free", devolver un valor predeterminado o NaN
        return NaN;
      }
    },
  },
};
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}

.dates {
  display: inline-block;
  font-size: 0.6em;
  margin-left: 1.5rem;
}
</style>
