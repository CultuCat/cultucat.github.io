<template>
  <v-row justify="center">
    <v-col class="mb-0 pb-0">
      <h1 style="color: #ff6961" class="mt-5 ml-5">{{$t('HOME.Benvingut')}}, {{ user.user.first_name }}</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-container class="d-flex justify-center align-center">
      <v-card rounded="lg">
        <v-col cols="12">
          <v-row justify="center">
            <template v-for="button in buttons" :key="button.label">
              <v-btn class="my-5 mx-3" rounded="lg" color="#ff6961"
              :prepend-icon="button.icon" @click="button.dialog = true">
              {{ button.label }}
            </v-btn>
            <eventDialog :dialog="button.dialog" :label="button.label" :icon="button.icon" @closeDialog="button.dialog = false"/>
            </template>
          </v-row>
          <v-row justify="space-evenly">
            <template v-if="events.length > 0">
              <ticketCard v-for="event in events" :key="event.id" @click="navigateToEvent(event.id)" :ticket="event"
                class="my-4 mx-2" />
            </template>
            <template v-else>
              <v-card v-for="n in 20" :key="n" class="my-4 mx-2 v-card" width="250" height="250">
                <v-skeleton-loader type="image, image" />
              </v-card>
            </template>
          </v-row>
        </v-col>
      </v-card>
    </v-container>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
import ticketCard from "@/components/ticketCard.vue";
import eventDialog from "@/components/eventDialog.vue";

export default {
  components: {
    ticketCard,
    eventDialog,
  },
  data() {
    return {
      events: [],
      dialogToday: false,
      dialogWeek: false,
      dialogFree: false,
      dialogPopular: false,
      buttons: [
        {
          label: $t('HOME.Avui'),
          icon: "mdi-calendar-today",
          dialog: this.dialogToday,
        },
        {
          label: $t('HOME.Setmana'),
          icon: "mdi-calendar-week",
          dialog: this.dialogWeek,
        },
        {
          label: $t('HOME.Gratis'),
          icon: "mdi-currency-usd-off",
          dialog: this.dialogFree,
        },
        {
          label: $t('HOME.Popular'),
          icon: "mdi-trending-up",
          dialog: this.dialogPopular,
        }
      ],
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
        .then(data => this.events = data)
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
