<template>
  <v-col>
    <template v-if="eventInfo.nom">
      <!-- =============================== TITULO ================================ -->
      <h1 style="color: #ff6961" class="my-5 ml-5 mb-0">Event</h1>
      <!-- ============================== CONTENIDO ============================== -->
      <v-container class="d-flex justify-center align-center">
        <v-col cols="12" md="11" sm="8">

          <v-card rounded="lg" style="position: relative">
            <v-btn @click="handleButtonLink" icon style="position: absolute; top: 10px; right: 10px" rounded="lg">
              <v-icon>mdi-link</v-icon>
            </v-btn>
            <v-row class="d-flex ma-2 fill-height">
              <v-img class="ma-5" :src="eventInfo.imatges_list[0]" :max-height="250" :max-width="250" aspect-ratio="1/1"
                cover style="border-radius: 15px" />
              <v-col class="d-flex fill-height">
                <v-col>
                  <v-card-title>{{ eventInfo.nom }}</v-card-title>
                  <v-card-subtitle>{{ transformDate(eventInfo.dataIni) }}</v-card-subtitle>
                  <v-card-subtitle>{{ eventInfo.espai }}</v-card-subtitle>

                  <!-- No nos pasan tags -->
                  <!-- <v-chip-group class="mx-2">
                  <v-chip v-for="tag in tags" :key="tag" class="mx-1">{{ tag }}</v-chip>
                </v-chip-group> -->

                  <v-card class="mt-14" rounded="lg" color="#ff6961" style="max-width: 220px">
                    <div class="d-flex justify-center align-center" v-if="eventInfo.preu">
                      <div class="mr-2">
                        {{ extraerTextoPreu(eventInfo.preu) }}
                      </div>
                      <v-btn v-if="canIBuy" class="ma-2" @click="dialogBuy = true">Buy</v-btn>
                      <v-btn v-else class="ma-2" disabled>Buy</v-btn>
                      <!-- ------------------------- dialog para comprar ------------------------- -->
                      <v-dialog v-model="dialogBuy" scrollable max-width="800px">
                        <BuyComponent :eventInfo="eventInfo" :buyLoading="buyLoading" :discounts="discounts" @confirmed-buy="buyConfirmed" @cancel-buy="reset" />
                      </v-dialog>
                      <!-- ----------------------------------------------------------------------- -->
                    </div>
                    <div class="d-flex justify-center align-center" v-else>
                      <v-btn variant="text" :ripple="false" class="ma-2" density="compact" disabled>Preu no disponible</v-btn>
                    </div>
                  </v-card>
                </v-col>
              </v-col>
              <v-col class="d-flex flex-column fill-height ma-5 mt-15">
                <v-btn class="ma-2 pa-2" rounded="lg" @click="dialog = true">See assistants</v-btn>
                <!-- --------------------- dialog para ver asistentes ---------------------- -->
                <v-dialog v-model="dialog" scrollable max-width="800px">
                  <v-card>
                    <v-toolbar color="#ff6961" dark>
                      <v-icon size="35" class="ml-6">mdi-account-group</v-icon>
                      <v-toolbar-title class="ml-6">Assistants</v-toolbar-title>
                      <v-spacer></v-spacer>
                      <v-toolbar-items>
                        <v-btn icon dark variant="plain" @click="dialog = false">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text style="height: 600px">
                      <ListOfItems v-if="eventInfo.assistants.length > 0" :items="eventInfo.assistants" />
                      <span v-else style="display: flex; justify-content: center;">No hi ha usuaris amb entrada per aquest
                        esdeveniment</span>
                    </v-card-text>
                  </v-card>
                </v-dialog>
                <!-- ----------------------------------------------------------------------- -->
                <v-btn @click="agregarEventoAlCalendario" class="ma-2 pa-2" rounded="lg">Add to calendar</v-btn>
                <v-btn @click="handleButtonMaps" class="ma-2 pa-2" rounded="lg">See location</v-btn>
              </v-col>
            </v-row>
            <v-row class="d-flex ma-2">
              <v-col class="ma-5" style="width: 80%">
                <h2>Description</h2>
                <div style="text-align: justify">
                  {{ eventInfo.descripcio }}
                </div>
                <v-divider class="my-2" />
                <h2>Do you know?</h2>
                <div style="text-align: justify">
                  {{ eventInfo.curiosity }}
                </div>
                <v-divider class="my-2" />
                <h2>Comment</h2>
                <commentForm @comment-posted="fetchComments"></commentForm>
                {{ eventInfo.comments }}
                <template v-if="eventInfo.comments && eventInfo.comments.results.length > 0">
                  <comment v-for="comment in eventInfo.comments.results" :comment="comment" :key="comment.id"></comment>
                </template>
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
import ListOfItems from "@/components/listOfItems.vue";
import BuyComponent from "@/components/buy.vue";
import { mapGetters } from "vuex";
import axios from "axios";
</script>

<script>
export default {
  name: "Event",
  components: {
    commentForm,
    comment,
    BuyComponent,
    ListOfItems,
  },
  data() {
    return {
      eventInfo: {
        id: null,
        nom: null,
        descripcio: null,
        dataIni: null,
        espai: null,
        preu: null,
        imatges_list: null,
        latitud: null,
        longitud: null,
        link: null,
        comments: null,
        curiosity:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac sapien quis libero ullamcorper varius. In ut turpis id quam auctor porta. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam auctor bibendum justo, a rhoncus turpis hendrerit ac. Maecenas id tellus sed dolor tempus congue. Nunc at diam vel massa mattis elementum ac a dolor. Nulla facilisi. Sed in lacinia nunc. Quisque vel justo euismod, feugiat arcu ac, efficitur ipsum. Sed vulputate mi id odio consequat, sit amet varius neque rhoncus. Integer eu sollicitudin libero.",
        assistants: [],
      },
      dialog: false,
      dialogBuy: false,
      buyLoading: false,
      canIBuy: true,
      discounts: [],
    };
  },
  computed: {
    mapsURL() {
      return (
        "https://maps.google.com/?q=" +
        this.eventInfo.latitud +
        "," +
        this.eventInfo.longitud
      );
    },
    ...mapGetters(["user"]),
  },
  created() {
    fetch("https://cultucat.hemanuelpc.es/events/" + this.$route.params.event_id + "/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        this.eventInfo.id = data.id;
        this.eventInfo.nom = data.nom;
        this.eventInfo.descripcio = data.descripcio;
        this.eventInfo.dataIni = data.dataIni;
        this.eventInfo.espai = data.espai.nom;
        this.eventInfo.preu = data.preu;
        this.eventInfo.imatges_list = data.imatges_list;
        this.eventInfo.latitud = data.latitud;
        this.eventInfo.longitud = data.longitud;
        this.eventInfo.link = data.enllacos_list[0];
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      fetch("https://cultucat.hemanuelpc.es/discounts/?userDiscount=" + this.user.user.id)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        this.discounts = data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    fetch("https://cultucat.hemanuelpc.es/comments/?event=" + this.$route.params.event_id)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        this.eventInfo.comments = data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    fetch("https://cultucat.hemanuelpc.es/tickets/?event=" + this.$route.params.event_id)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        this.eventInfo.assistants = data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },
  methods: {
    handleButtonLink() {
      window.open(this.eventInfo.link, "_blank");
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
      if (!match) this.canIBuy = false;
      return match ? match[0] : texto;
    },
    agregarEventoAlCalendario() {
      const evento = {
        title: this.eventInfo.nom,
        description: this.eventInfo.descripcio,
        startDate: this.eventInfo.dataIni,
        endDate: this.eventInfo.dataFi || this.eventInfo.dataIni,
        location: this.eventInfo.espai.nom,
      };

      const calendarEvent = {
        title: evento.title,
        description: evento.description,
        location: evento.location,
        start: evento.startDate,
        end: evento.endDate
      };

      const icalData = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${calendarEvent.start}
DTEND:${calendarEvent.end}
SUMMARY:${calendarEvent.title}
DESCRIPTION:${calendarEvent.description}
LOCATION:${calendarEvent.location}
END:VEVENT
END:VCALENDAR
`;

      const icalDataFormatted = icalData.replace(/\n\s+/g, '\n').trim();


      const blob = new Blob([icalData], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'event.ics');
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
    },
    async fetchComments() {
      try {
        console.log(this.$route.params.event_id)
        const response = await fetch('https://cultucat.hemanuelpc.es/comments/?event=' + this.$route.params.event_id);

        if (response.ok) {
          const data = await response.json();
          this.eventInfo.comments = data;
        } else {
          console.error('Error fetching comments');
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    buyConfirmed(isLoading, discountUsed) {
      this.buyLoading = isLoading;
      const params = JSON.stringify({
        event: this.eventInfo.id,
        discount: discountUsed
      });
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.user.token}`
        }
      };
      axios
        .post(
          "https://cultucat.hemanuelpc.es/tickets/",
          params,
          config
        )
        .then((response) => {
          if (response.status === 201) {
            window.location.pathname = "/home";
            return response.json;
          }
        })
        .catch((error) => {
          // Maneja errores aquí
          console.error("Error al comprar el ticket: ", error);
        })
        .finally(() => {
          this.reset();
          this.buyLoading = false;
        });
    },
    reset() {
      this.dialogBuy = false;
    },
  },
};
</script>
