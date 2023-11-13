<!-- ======================================================================= -->
<!--                         VISTA LISTA DE EVENTOS                          -->
<!-- ======================================================================= -->

<template>
  <template v-if="itemsJSON.length > 0">
  <v-col>
    <h1 style="color: #ff6961" class="my-5 ml-5">Events</h1>
    
      <ListOfItems :items="itemsJSON" />
  </v-col>
  </template>
</template>

<!-- =============================== SCRIPTS =============================== -->

<script setup>
import ListOfItems from "@/components/listOfItems.vue";
</script>

<script>
export default {
  data() {
    return {
      itemsJSON: [],
      loading: false,
      urlToFetch: "https://cultucat.hemanuelpc.es/events/?ordering=-dataIni",
      //array de eventos generado aleatoriamente
      /*items: [
        {
          id: 1,
          startDate: "15/02/2023",
          endDate: "15/04/2023",
          name: "Renewing Perspectives",
          description:
            "An exhibition showcasing works by Catalan modern artists.",
          price: "10 €",
          location: "Barcelona",
          tags: ["art", "catalan", "modernism"],
        },
        {
          id: 2,
          startDate: "20/07/2023",
          endDate: "22/07/2023",
          name: "Folklore in the Park",
          description:
            "Three days of traditional Catalan folk music in a natural setting.",
          price: "Free",
          location: "Girona",
          tags: ["music", "folklore", "catalan"],
        },
        {
          id: 3,
          startDate: "10/06/2023",
          endDate: "10/08/2023",
          name: "Shakespeare in the Castle",
          description:
            "Performances of Shakespeare's works in a medieval castle.",
          price: "15 €",
          location: "Tarragona",
          tags: ["theatre", "shakespeare", "literature"],
        },
        {
          id: 4,
          startDate: "30/04/2023",
          endDate: "30/04/2023",
          name: "Jazz Night in the Square",
          description:
            "Open-air concert featuring international jazz musicians.",
          price: "20 €",
          location: "Lleida",
          tags: ["music", "jazz"],
        },
        {
          id: 5,
          startDate: "05/09/2023",
          endDate: "05/09/2023",
          name: "CineAutopía",
          description:
            "A selection of independent films and discussions with directors.",
          price: "12 € (general admission), 8 € (students)",
          location: "Reus",
          tags: ["films"],
        },
        {
          id: 6,
          startDate: "15/10/2023",
          endDate: "18/10/2023",
          name: "JazzFest",
          description:
            "A weekend of jazz performances by international artists.",
          price: "20 € (general admission)",
          location: "Barcelona",
          tags: ["music"],
        },
        {
          id: 7,
          startDate: "22/11/2023",
          endDate: "24/11/2023",
          name: "ArtExpo",
          description: "Exhibition of contemporary art with renowned artists.",
          price: "Free",
          location: "Girona",
          tags: ["art"],
        },
        {
          id: 8,
          startDate: "08/12/2023",
          endDate: "10/12/2023",
          name: "CinemaWeek",
          description: "Screenings of classic and cult films.",
          price: "10 € (general admission), 7 € (students)",
          location: "Tarragona",
          tags: ["films"],
        },
        {
          id: 9,
          startDate: "05/01/2024",
          endDate: "08/01/2024",
          name: "Shakespeare Festival",
          description: "Theater performances of Shakespeare's plays.",
          price: "15 € (general admission)",
          location: "Lleida",
          tags: ["theatre"],
        },
        {
          id: 10,
          startDate: "25/02/2024",
          endDate: "28/02/2024",
          name: "MusicFusion",
          description: "A fusion of various music genres by local artists.",
          price: "Free",
          location: "Terrassa",
          tags: ["music", "art"],
        },
      ],*/
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
