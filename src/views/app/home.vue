<template>
  <v-row justify="center">
    <v-col class="mb-0 pb-0">
      <h1 style="color: #ff6961" class="my-5 ml-5">Benvingut, {{ user.user.first_name }}</h1>
    </v-col>
  </v-row>
  <v-row>
    <template v-if="currentEvents.length > 0">
      <v-col cols="12">
        <v-row justify="space-evenly">
          <ticketCard v-for="event in currentEvents" :key="event.id" @click="navigateToEvent(event.id)" :ticket="event"
            class="my-4" />
        </v-row>
      </v-col>
    </template>
    <template v-else>
      <v-col cols="12">
        <v-row justify="space-evenly">
          <v-card v-for="n in 12" :key="n" class="my-4 v-card" width="250" height="250" :variant="elevated">
            <v-skeleton-loader type="image, image" />
          </v-card>
        </v-row>
      </v-col>
    </template>
  </v-row>
</template>

<script setup>
import { mapGetters } from "vuex";
import ticketCard from "@/components/ticketCard.vue";
</script>

<script>
export default {
  components: {
    ticketCard,
  },
  data() {
    return {
      currentEvents: [],
    };
  },
  created() {
    const promises = this.user.user.espais_preferits.map(espai => this.fetchEvents(espai));
    Promise.all(promises)
      .then(results => this.currentEvents = [].concat(...results))
      .catch(error => console.error("Error fetching events:", error));
  },
  methods: {
    navigateToEvent(eventId) {
      this.$router.push(`/events/${eventId}`);
    },
    fetchEvents(espai) {
      return fetch(`https://cultucat.hemanuelpc.es/events/?espai=${espai.id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("No se pudo obtener el archivo JSON");
          }
          return response.json();
        })
        .then(data => data.results)
        .catch(error => {
          console.error("Error:", error);
        });
    },
  },
  computed: {
    ...mapGetters(["user"]),
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 15px;
}
</style>
