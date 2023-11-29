<template>
  <v-col>
    <h1 style="color: #ff6961" class="my-5 ml-5 mb-0">Tickets</h1>
    <v-container class="d-flex justify-center align-center">
      <v-col cols="12" md="11" sm="8">
        <v-card rounded="lg" :loading="loading">
          <template v-if="loading == true">
            <v-card-text>Carregant...</v-card-text>
          </template>
          <template v-else>
            <template v-if="tickets.length > 0">
              <v-switch class="switch" v-model="showAllTickets" label="See all events" color="primary"></v-switch>
              <template class="d-flex tickets">
                <template v-if="filteredTickets.length > 0">
                  <ticket-card class="ma-5" v-for="ticket in filteredTickets" :key="ticket.id" @click="openPopup(ticket)"
                    :ticket="ticket"></ticket-card>
                      <ticket-popup ref="popUp" :id="this.id" :title="this.title"></ticket-popup>
                    
                </template>
                <v-card-text v-else>No tens entrades per propers esdeveniments</v-card-text>
              </template>
            </template>
            <v-card-text v-else>No tens entrades a esdeveniments</v-card-text>
          </template>
        </v-card>
      </v-col>
    </v-container>
  </v-col>
</template>

<script>
import TicketPopup from '@/components/ticketPopup.vue';
import TicketCard from '@/components/ticketCard.vue';
import { mapGetters } from 'vuex';

export default {
  name: "Tickets",
  components: {
    TicketCard,
    TicketPopup
  },
  data() {
    return {
      dialog: false,
      id: null,
      title: null,
      tickets: [],
      showAllTickets: false,
      loading: false,
      defaultQr: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png?20200615212723'
    }
  },
  computed: {
    ...mapGetters(['user']),
    filteredTickets() {
      if (this.showAllTickets) {
        return this.tickets;
      } else {
        const today = new Date();
        return this.tickets.filter(ticket => new Date(ticket.data) >= today);
      }
    }
  },
  created() {
    this.loading = true;
    fetch(`https://cultucat.hemanuelpc.es/tickets/?user=${this.user.user.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el archivo JSON");
        }
        return response.json();
      })
      .then((data) => {
        this.tickets = data;
        this.loading = false;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },
  methods: {
    openPopup(ticket) {
      this.id = ticket.id.toString();
      this.title = ticket.nomEvent;
      this.$refs.popUp.openPopup();

    },
  },
}
</script>

<style scoped>
.switch {
  position: absolute;
  top: 20px;
  left: 50px;
}

.tickets {
  position: relative;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 5rem;
}
</style>
