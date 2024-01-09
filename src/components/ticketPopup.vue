<template>
  <v-dialog v-model="show" persistent max-width="500px" scrollable>
    <v-card class="pa-8" rounded="lg">
      <v-row>
        <h1>{{ $t('TICKETS.ticket') }}</h1>
      </v-row>
      <v-row class="align-center justify-center">
        <v-col cols="4">
          <v-img :src="ticket.imatges_list[0]" cover aspect-ratio="1" style="border-radius: 5px;" />
        </v-col>
        <v-col>
          <h2>{{ ticket.nomEvent }}</h2>
          <p>{{ transformDate(ticket.dataIni) }} - {{ transformDate(ticket.dataFi) }}</p>
          <p>{{ ticket.espai }}</p>
        </v-col>
      </v-row>
      <v-row class="mb-2" justify="center">
        <v-img height="240" :src="ticket.image" />
      </v-row>
      <v-row class="align-center" style="justify-content: space-between;">
        <v-icon color="medium-emphasis" @click="downloadTicket">mdi-download</v-icon>
        <v-btn class="text-none" color="medium-emphasis" min-width="92" rounded variant="outlined" @click="closePopup">
          {{ $t('close') }}
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    ticket: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    downloadTicket() {
      window.open(this.ticket.pdf_url, '_blank');
    },
    closePopup() {
      this.show = false;
    },
    openPopup() {
      this.show = true;
    },
    transformDate(date) {
      const dateObj = new Date(date);
      const formatOptions = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      const formatter = new Intl.DateTimeFormat(`${this.$t('data')}`, formatOptions);
      return formatter.format(dateObj);
    },
  },
};
</script>

<style scoped lang="scss"></style>
