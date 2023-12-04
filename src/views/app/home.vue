<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1 class="title">Cultucat</h1>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h2 class="subtitle">Benvingut, {{ user.user.first_name }}</h2>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="6" md="4" lg="3" v-if="currentEvents.length > 0" v-for="ticket in currentEvents" :key="ticket.id">
        <eventCard class="ma-5" @click="openPopup(ticket)" :ticket="ticket"></eventCard>
      </v-col>
      <v-col cols="12" class="text-center" v-else>
        <v-card-text>Carregant sugerencies...</v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { mapGetters } from "vuex";
  import ListOfItems from "@/components/listOfItems.vue";
  import eventCard from "@/components/eventCard.vue";
</script>

<script>
export default {
  data() {
    return {
      currentEvents: [],
      url: "",
      eventsUrl: "",
      view: "map",
    };
  },
  created() {
    this.url = "https://cultucat.hemanuelpc.es";
    let promises = this.user.user.espais_preferits.map(espai => {
      return this.fetchEvents(espai);
    });
    Promise.all(promises).then(results => {
      this.currentEvents = [].concat(...results);
    });
  },
  methods: {
    fetchEvents(espai) {
      this.eventsUrl = `${this.url}/events/?espai=${espai.id}`;
      return fetch(this.eventsUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        return data.results;
        
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
    ListOfItems,
    eventCard
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