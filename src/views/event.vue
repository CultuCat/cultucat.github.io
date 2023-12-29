<template>
  <v-row justify="center">
    <v-col class="mb-0 pb-0">
      <h1 style="color: #ff6961" class="mt-5 ml-5">Event</h1>
    </v-col>
  </v-row>
  <v-row>
    <template v-if="eventInfo.nom">
      <!-- ============================== CONTENIDO ============================== -->
      <v-container class="justify-center align-center">
        <v-card rounded="lg">
          <v-col cols="12">
            <v-btn @click="handleButtonLink" style="position: absolute; top: 10px; right: 10px" rounded="lg">
              <v-icon>mdi-link</v-icon>
              <span style="margin-left: 5px;">Enllaç</span>
            </v-btn>
            <v-row justify="center">
              <v-col cols="3.5">
                <v-img class="ma-5" :src="eventInfo.imatges_list[0]" :max-height="250" :max-width="250" aspect-ratio="1"
                  cover style="border-radius: 15px" />
              </v-col>
              <v-col cols="5" class="d-flex fill-height">
                <v-col>
                  <v-card-title>{{ eventInfo.nom }}</v-card-title>
                  <v-card-subtitle>{{ transformDate(eventInfo.dataIni) }}</v-card-subtitle>
                  <v-card-subtitle>{{ eventInfo.espai }}</v-card-subtitle>

                  <v-chip-group class="mx-2">
                    <v-chip v-for="tag in eventInfo.tags" :key="tag.id" class="mx-1" style="background-color: #87CEEC;">
                      {{ tag.nom }}
                    </v-chip>
                  </v-chip-group>
                  <v-spacer class="my-16"/>
                  <v-card class="mt-2" rounded="lg" color="#ff6961" style="max-width: 220px">
                    <div class="d-flex justify-center align-center">
                      <div class="mr-2">
                        {{ isNumber(eventInfo.preu) ? `Preu: ${eventInfo.preu} €` : eventInfo.preu }}
                      </div>
                      <v-btn class="ma-2" @click="dialogBuy = true" :disabled="!canIBuy">Buy</v-btn>
                    </div>
                  </v-card>
                </v-col>
              </v-col>
              <v-col class="d-flex flex-column fill-height ma-5 mt-15">
                <v-btn class="ma-2 pa-2" rounded="lg" @click="dialog = true" :disabled="!canSeeAssistants">See assistants
                  ({{ this.eventInfo.assistants.length }})</v-btn>
                <!-- --------------------- dialog para ver asistentes ---------------------- -->
                <v-dialog v-model="dialog" scrollable max-width="600px">
                  <v-card>
                    <v-toolbar color="#ff6961" dark>
                      <v-icon size="35" class="ml-6">mdi-account-group</v-icon>
                      <v-toolbar-title class="ml-6">Assistants</v-toolbar-title>
                      <v-spacer />
                      <v-toolbar-items>
                        <v-btn icon dark variant="plain" @click="dialog = false">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-toolbar-items>
                    </v-toolbar>
                    <v-card-text style="height: 600px">
                      <ListOfItems v-if="eventInfo.assistants.length > 0" :items="eventInfo.assistants"
                        :isAssistants=true />
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
            <v-row class="d-flex ma-2" justify="center">
              <v-col class="ma-5" style="width: 80%">
                <h2>Description</h2>
                <div style="text-align: justify">
                  {{ eventInfo.descripcio }}
                </div>
                <v-divider class="my-2" />
                <template v-if="eventInfo.curiosity">
                  <h2>Do you know?</h2>
                  <div style="text-align: justify">
                    {{ eventInfo.curiosity.question.content }}
                  </div>
                  <div style="text-align: justify">
                    {{ eventInfo.curiosity.question.correct_answer }}
                  </div>
                  <v-divider class="my-2" />
                </template>
                <h2>Comment</h2>
                <commentForm @comment-posted="fetchComments"></commentForm>
                <template v-for="comment in eventInfo.comments.results" :key="comment.id">
                  <comment :commentProp="comment"></comment>
                </template>
              </v-col>
            </v-row>
          </v-col>
        </v-card>
      </v-container>
    </template>
  </v-row>
  <v-dialog v-model="dialogBuy" scrollable max-width="600px">
    <BuyComponent :eventInfo="eventInfo" :buyLoading="buyLoading" :discounts="discounts" @confirmed-buy="buyConfirmed"
      @cancel-buy="reset" />
  </v-dialog>
</template>

<script>
import commentForm from "@/components/commentForm.vue";
import comment from "@/components/comment.vue";
import ListOfItems from "@/components/listOfItems.vue";
import BuyComponent from "@/components/buy.vue";
import { mapGetters } from "vuex";
import axios from "axios";

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
        tags: [],
        dataIni: null,
        espai: null,
        preu: null,
        imatges_list: null,
        latitud: null,
        longitud: null,
        link: null,
        comments: [],
        curiosity: null,
        assistants: [],
      },
      dialog: false,
      dialogBuy: false,
      buyLoading: false,
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
    canIBuy() {
      return this.eventInfo.preu !== 'No disponible' && !this.eventInfo.assistants.some(assistant => assistant.id === this.user.user.id);
    },
    canSeeAssistants() {
      return this.eventInfo.preu !== 'No disponible';
    },
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
        this.eventInfo.tags = data.tags;
        this.eventInfo.dataIni = data.dataIni;
        this.eventInfo.espai = data.espai.nom;
        this.eventInfo.preu = data.preu;
        this.eventInfo.imatges_list = data.imatges_list;
        this.eventInfo.latitud = data.latitud;
        this.eventInfo.longitud = data.longitud;
        this.eventInfo.link = data.enllacos_list[0];
        this.eventInfo.assistants = data.assistents;
        this.eventInfo.curiosity = data.pregunta;
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
    fetch(`https://cultucat.hemanuelpc.es/events/${this.$route.params.event_id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        this.eventInfo.assistants = data.assistents;
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
    isNumber(value) {
      if (!value) return value;
      value = value.replace(',', '.');
      return !isNaN(Number(value)) && !isNaN(parseFloat(value));
    },
    transformDate(date) {
      const dateObj = new Date(date);
      const formatOptions = {
        weekday: "short",
        month: "long",
        day: "numeric",
        year: "numeric", // Agregando el año
      };
      const formatter = new Intl.DateTimeFormat("en-US", formatOptions);
      return formatter.format(dateObj);
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
            window.location.reload();
            return response.json;
          }
        })
        .catch((error) => {
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
    findAssistant(assistent, id) {
      return assistent.id === id;
    }
  },
};
</script>
