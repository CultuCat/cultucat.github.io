<template>
  <v-col>
    <h1 style="color: #ff6961" class="my-5 ml-5 mb-0">Tickets</h1>
    <v-container class="d-flex justify-center align-center">
      <v-col cols="12" md="11" sm="8">
        <v-card rounded="lg" :loading="loading">
          <v-switch class="switch" v-model="showAllTickets" label="See all events" color="primary"></v-switch>
          <div class="d-flex tickets">
            <ticket-card class="ma-5" v-for="ticket in filteredTickets" :key="ticket.id" :ticket="ticket"></ticket-card>
          </div>
        </v-card>
      </v-col>
    </v-container>
  </v-col>
</template>

<script>
import TicketCard from '@/components/ticketCard.vue';
import { mapGetters } from 'vuex';

export default {
  name: "Tickets",
  components: {
    TicketCard
  },
  data() {
    return {
      tickets: [],
      showAllTickets: false,
      loading: false,
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
    fetch(`https://cultucat.hemanuelpc.es/tickets/?user=1`)
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
      
  }
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
