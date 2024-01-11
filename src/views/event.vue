<template>
  <h1 style="color: #ff6961" class="mt-4 ml-5">{{ $t('EVENT.Event') }}</h1>
  <template v-if="eventInfo.nom">
    <!-- ============================== CONTENIDO ============================== -->
    <v-card class="mx-5 my-4" rounded="lg" elevation="4">
      <v-col cols="12">
        <v-btn @click="handleButtonLink" style="position: absolute; top: 15px; right: 15px" rounded="lg">
          <v-icon>mdi-link</v-icon>
          <span style="margin-left: 5px;">{{ $t('EVENT.Enlace') }}</span>
        </v-btn>
        <v-row justify="center">
          <v-col class="ml-5" cols="3.5">
            <v-img class="ma-5" :src="eventInfo.imatges_list[0]" :max-height="250" :max-width="250" aspect-ratio="1" cover
              style="border-radius: 15px" />
          </v-col>
          <v-col cols="5" class="d-flex fill-height">
            <v-col>
              <v-card-title>{{ eventInfo.nom }}</v-card-title>
              <v-card-subtitle>{{ transformDate(eventInfo.dataIni) }} - {{ transformDate(eventInfo.dataFi)
              }}</v-card-subtitle>
              <v-card-subtitle>{{ eventInfo.espai }}</v-card-subtitle>

              <v-chip-group class="mx-2">
                <v-chip v-for="tag in eventInfo.tags" :key="tag.id" class="mx-1" style="background-color: #87CEEC;">
                  {{ tag.nom }}
                </v-chip>
              </v-chip-group>
              <v-spacer class="my-16" />
              <v-card class="mt-2 d-flex justify-center align-center" rounded="lg" color="#ff6961"
                style="max-width: 245px">
                <div class="mx-2">
                  {{ isNumber(eventInfo.preu) ? `Preu: ${eventInfo.preu} €` : eventInfo.preu }}
                </div>
                <v-btn class="ma-2" @click="dialogBuy = true" :disabled="!canIBuy">{{ $t('EVENT.Buy') }}</v-btn>
              </v-card>
            </v-col>
          </v-col>
          <v-col class="d-flex flex-column fill-height ma-5 mt-15 mr-8">
            <v-btn class="ma-2 pa-2" rounded="lg" @click="dialog = true" :disabled="!canSeeAssistants">
              {{ $t('EVENT.Veure_assistents') }} ({{ this.eventInfo.assistants.length }})
            </v-btn>
            <userDialog :dialog="dialog" :usersArray="eventInfo.assistants" :title="$t('EVENT.Assistents')"
              icon="mdi-account-group" @closeDialog="dialog = false" />
            <v-btn @click="agregarEventoAlCalendario" class="ma-2 pa-2" rounded="lg">{{ $t('EVENT.Calendari') }}</v-btn>
            <v-btn @click="handleButtonMaps" class="ma-2 pa-2" rounded="lg">{{ $t('EVENT.localitzacio') }}</v-btn>
          </v-col>
        </v-row>
        <v-row class="d-flex ma-2 mt-0" justify="center">
          <v-col class="ma-5 mt-0" style="width: 80%">
            <h2>{{ $t('EVENT.Descripcio') }}</h2>
            <div style="text-align: justify">
              {{ eventInfo.descripcio }}
            </div>
            <v-divider class="my-2" />

            <template v-if="eventInfo.curiosity">
              <h2>{{ $t('EVENT.know') }}</h2>
              <div style="text-align: justify">
                {{ eventInfo.curiosity.question.content }}
              </div>
              <div style="text-align: justify">
                {{ eventInfo.curiosity.question.correct_answer }}
              </div>
              <v-divider class="my-2" />
            </template>
            <h2>{{$t('EVENT.Comentaris')}}</h2>
            <commentForm @comment-posted="fetchComments"></commentForm>
            <template v-for="comment in eventInfo.comments.results" :key="comment.id">
              <comment :commentProp="comment"></comment>
            </template>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </template>
  <v-dialog v-model="dialogBuy" scrollable max-width="600px">
    <BuyComponent :eventInfo="eventInfo" :buyLoading="buyLoading" :discounts="discounts" @confirmed-buy="buyConfirmed"
      @cancel-buy="reset" />
  </v-dialog>
</template>

<script>
import commentForm from "@/components/commentForm.vue";
import comment from "@/components/comment.vue";
import userDialog from "@/components/userDialog.vue";
import BuyComponent from "@/components/buy.vue";
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "Event",
  components: {
    commentForm,
    comment,
    BuyComponent,
    userDialog,
  },
  data() {
    return {
      eventInfo: {
        id: null,
        nom: null,
        descripcio: null,
        tags: [],
        dataIni: null,
        dataFi: null,
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
        this.eventInfo.dataFi = data.dataFi;
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
      const formatter = new Intl.DateTimeFormat(`${this.$t('data')}`, formatOptions);
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
