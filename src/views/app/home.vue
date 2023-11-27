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
        <ListOfItems :items="currentEvents" :view="view"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { mapGetters } from "vuex";
  import ListOfItems from "@/components/listOfItems.vue";
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
      this.$forceUpdate();
      console.log(this.currentEvents);
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