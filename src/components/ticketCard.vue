<template>
    <v-card class="v-card" :image="ticket.imatge" link width="250" height="250" :variant="elevated" @click="handleClick()">
        <div class="overlay d-flex flex-column justify-end">
            <v-card-title class="text">{{ ticket.nomEvent }}</v-card-title>
            <v-card-subtitle class="text">{{ transformDate(ticket.data) }}</v-card-subtitle>
            <v-card-subtitle class="text mb-3">{{ ticket.espai }}</v-card-subtitle>
        </div>
    </v-card>
</template>
  
<script>
export default {
    name: "TicketCard",
    props: {
        ticket: Object,
    },
    methods: {
        handleClick() {
            this.$router.push({ path: `/tickets/${this.ticket.id}` });
        },
        transformDate(date) {
            const dateObj = new Date(date);
            const formatOptions = {
                weekday: "short",
                month: "short",
                day: "numeric",
            };
            const formatter = new Intl.DateTimeFormat("en-US", formatOptions);
            return formatter.format(dateObj);
        },
    }
};
</script>
  
<style scoped>
.v-card {
    border-radius: 15px;
}

.text {
    color: white;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    border-radius: 15px;
    pointer-events: none;
}
</style>
  