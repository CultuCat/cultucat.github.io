<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1 class="title">Cultucat</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="subtitle">Events in favourite places</h2>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12">
        <events :items="this.events" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { mapGetters } from "vuex";
  import events from '@/components/listOfItems.vue'
</script>

<script>
export default {
  data() {
    return {
      events: [],
      url: "",
      eventsUrl: "",
    };
  },
  created() {
    this.url = "https://cultucat.hemanuelpc.es";
    this.eventsUrl = `${this.url}/events/?ordering=-dataIni`;
    //this.events = this.fetchEvents();
  },
  methods: {
    fetchEvents() {
      fetch(this.fetchEventsUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        this.events= data.results;
        this.eventsUrl = data.next;
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        
      });
    },
  },
  computed: {
    ...mapGetters(["user"]),
  },
  components: {
    events,
  },
};
</script>
<style lang="scss" scoped>
.title {
  font-size: 3em;
  color: $primary;
  font-weight: bold;
  margin-bottom: 0.5em;
}

.subtitle {
  font-size: 1.5em;
  color: $terciary;
  font-style: italic;
  margin-bottom: 2em;
}
</style>