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
          <v-card v-for="n in 20" :key="n" class="my-4 v-card" width="250" height="250" :variant="elevated">
            <v-skeleton-loader type="image, image" />
          </v-card>
        </v-row>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import ticketCard from "@/components/ticketCard.vue";

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
    this.fetchEvents();
  },
  methods: {
    navigateToEvent(eventId) {
      this.$router.push(`/events/${eventId}`);
    },
    fetchEvents() {
      fetch('https://cultucat.hemanuelpc.es/events/home', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.user.token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("No se pudo obtener el archivo JSON");
          }
          return response.json();
        })
        .then(data => this.currentEvents = data)
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
