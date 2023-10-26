<template>
  <v-col>
    <template v-if="eventJSON">
    <!-- =============================== TITULO ================================ -->
    <h1 style="color: #ff6961" class="my-5 ml-5 mb-0">Event</h1>
    <!-- ============================== CONTENIDO ============================== -->
    <v-container class="d-flex justify-center align-center">
      <v-col cols="12" md="11" sm="8">
        
          <v-card rounded="lg" style="position: relative">
            <v-btn
              @click="handleButtonLink"
              icon
              style="position: absolute; top: 10px; right: 10px"
              rounded="lg"
            >
              <v-icon>mdi-link</v-icon>
            </v-btn>
            <v-row class="d-flex ma-2 fill-height">
              <v-img
                class="ma-5"
                :src="eventJSON.imatges_list[0]"
                :max-height="250"
                :max-width="250"
                aspect-ratio="1/1"
                cover
                style="border-radius: 15px"
              />
              <v-col class="d-flex fill-height">
                <v-col>
                  <v-card-title>{{ eventJSON.nom }}</v-card-title>
                  <v-card-subtitle>{{
                    transformDate(eventJSON.dataIni)
                  }}</v-card-subtitle>
                  <v-card-subtitle>{{ eventJSON.espai }}</v-card-subtitle>

                  <!-- No nos pasan tags -->
                  <!-- <v-chip-group class="mx-2">
                  <v-chip v-for="tag in tags" :key="tag" class="mx-1">{{ tag }}</v-chip>
                </v-chip-group> -->

                  <v-card
                    class="mt-14"
                    rounded="lg"
                    color="#ff6961"
                    style="max-width: 220px"
                  >
                    <div class="d-flex justify-center align-center" v-if="eventJSON.preu">
                      <div class="mr-2">
                        {{ extraerTextoPreu(eventJSON.preu)}}
                      </div>
                      <v-btn class="ma-2">Buy</v-btn>
                    </div>
                    <div class="d-flex justify-center align-center" v-else>
                      <v-btn variant="text" :ripple="false" class="ma-2" density="compact">Preu no disponible</v-btn>
                    </div>
                  </v-card>
                </v-col>
              </v-col>
              <v-col class="d-flex flex-column fill-height ma-5 mt-15">
                <v-btn class="ma-2 pa-2" rounded="lg">See assistants</v-btn>
                <v-btn class="ma-2 pa-2" rounded="lg">Add to calendar</v-btn>
                <v-btn @click="handleButtonMaps" class="ma-2 pa-2" rounded="lg"
                  >See location</v-btn
                >
              </v-col>
            </v-row>
            <v-row class="d-flex ma-2">
              <v-col class="ma-5" style="width: 80%">
                <h2>Description</h2>
                <div style="text-align: justify">
                  {{ eventJSON.descripcio }}
                </div>
                <v-divider class="my-2" />
                <h2>Do you know?</h2>
                <div style="text-align: justify">
                  {{ curiosity }}
                </div>
                <v-divider class="my-2" />
                <h2>Comment</h2>
                <commentForm></commentForm>
                <comment
                  v-for="comment in comments"
                  :comment="comment"
                  :key="comment.id"
                ></comment>
              </v-col>
            </v-row>
          </v-card>
      </v-col>
    </v-container>
  </template>
  </v-col>
</template>

<script setup>
import commentForm from "@/components/commentForm.vue";
import comment from "@/components/comment.vue";
</script>

<script>
export default {
  name: "Event",
  components: {
    commentForm,
    comment,
  },
  data() {
    return {
      eventJSON: null,
      curiosity:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac sapien quis libero ullamcorper varius. In ut turpis id quam auctor porta. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam auctor bibendum justo, a rhoncus turpis hendrerit ac. Maecenas id tellus sed dolor tempus congue. Nunc at diam vel massa mattis elementum ac a dolor. Nulla facilisi. Sed in lacinia nunc. Quisque vel justo euismod, feugiat arcu ac, efficitur ipsum. Sed vulputate mi id odio consequat, sit amet varius neque rhoncus. Integer eu sollicitudin libero.",
      comments: [
        {
          username: "Ericriiera",
          time: "today",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac sapien quis libero ullamcorper varius. In ut turpis id quam auctor porta. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam auctor bibendum justo, a rhoncus turpis hendrerit ac. Maecenas id tellus sed dolor tempus congue. Nunc at diam vel massa mattis elementum ac a dolor. Nulla facilisi. Sed in lacinia nunc. Quisque vel justo euismod, feugiat arcu ac, efficitur ipsum. Sed vulputate mi id odio consequat, sit amet varius neque rhoncus. Integer eu sollicitudin libero.",
        },
        {
          username: "Ericriiera",
          time: "today",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac sapien quis libero ullamcorper varius. In ut turpis id quam auctor porta. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam auctor bibendum justo, a rhoncus turpis hendrerit ac. Maecenas id tellus sed dolor tempus congue. Nunc at diam vel massa mattis elementum ac a dolor. Nulla facilisi. Sed in lacinia nunc. Quisque vel justo euismod, feugiat arcu ac, efficitur ipsum. Sed vulputate mi id odio consequat, sit amet varius neque rhoncus. Integer eu sollicitudin libero.",
        },
      ],
      title: "Event Title",
      date: "21-05-23",
      link: "https://www.google.com",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac sapien quis libero ullamcorper varius. In ut turpis id quam auctor porta. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam auctor bibendum justo, a rhoncus turpis hendrerit ac. Maecenas id tellus sed dolor tempus congue. Nunc at diam vel massa mattis elementum ac a dolor. Nulla facilisi. Sed in lacinia nunc. Quisque vel justo euismod, feugiat arcu ac, efficitur ipsum. Sed vulputate mi id odio consequat, sit amet varius neque rhoncus. Integer eu sollicitudin libero.",
      assistants: [],
      latitud: "41.637325",
      longitud: "2.1574353",
    };
  },
  computed: {
    mapsURL() {
      return (
        "https://maps.google.com/?q=" +
        this.eventJSON.latitud +
        "," +
        this.eventJSON.longitud
      );
    },
  },
  created() {
    fetch("http://127.0.0.1:8000/events/" + this.$route.params.event_id + "/")
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se pudo obtener el archivo JSON");
          }
          return response.json();
        })
        .then((data) => {
          this.eventJSON = data; // Trabaja con los datos JSON aquí
        })
        .catch((error) => {
          console.error("Error:", error);
        });
  },
  methods: {
    handleButtonLink() {
      window.open(this.link, "_blank");
    },
    handleButtonMaps() {
      window.open(this.mapsURL, "_blank");
    },
    transformDate(date) {
      const dateObj = new Date(date);
      const formatOptions = {
        weekday: "short", // Short weekday format (e.g., Sat)
        month: "long", // Long month format (e.g., October)
        day: "numeric", // Numeric day format (e.g., 22)
      };
      const formatter = new Intl.DateTimeFormat("en-US", formatOptions);
      return formatter.format(dateObj);
    },
    extraerTextoPreu(texto) {
      // Utilizamos una expresión regular para buscar la parte deseada del texto
      const match = texto.match(/(\d[^€]*)€/);
      return match ? match[0] : texto;
    },
  },
};
</script>
