<template>
  <template v-if="itemsJSON.length > 0">
  <v-col>
    <h1 style="color: #ff6961" class="mt-5 ml-5">Search</h1>
      <ListOfItems :items="itemsJSON" view="events"/>
  </v-col>
  </template>
</template>

<script setup>
import ListOfItems from "@/components/listOfItems.vue";
</script>

<script>
export default {
  data() {
    return {
      itemsJSON: [],
      isLoading: false,
      urlToFetch: "https://cultucat.hemanuelpc.es/events/?ordering=dataIni",
    };
  },
  created() {
    this.fetchData();
    window.addEventListener('scroll', this.handleScroll);
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    fetchData() {
      this.isLoading = true;
      fetch(this.urlToFetch)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        this.itemsJSON = this.itemsJSON.concat(data.results);
        this.urlToFetch = data.next;
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        this.isLoading = false; // Restablecer isLoading después de la solicitud, ya sea exitosa o con error
      });
    },
    handleScroll() {
      if (!this.isLoading) {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollY + windowHeight >= documentHeight - 100) {
          this.fetchData();
        }
      }
    },
  },
  components: {
    ListOfItems,
  },
};
</script>
