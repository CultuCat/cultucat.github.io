<!-- ======================================================================= -->
<!--                COMPONENTE QUE LISTA EVENTOS DE UN ARRAY                 -->
<!-- ======================================================================= -->

<template>
    <v-col>
        <v-container class="d-flex justify-center align-center">
            <v-col cols="10">
                <v-card elevation="4">
                    <v-toolbar color="#ff6961" dark>
                        <v-icon size="35" class="ml-6">mdi-ticket</v-icon>
                        <v-toolbar-title>Purchase summary</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-toolbar-items>
                            <v-btn icon dark variant="plain" @click="cancel">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-toolbar-items>
                    </v-toolbar>
                    <v-list class="ml-6 mt-2">
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title><strong>Event name:</strong></v-list-item-title>
                                <v-list-item-subtitle>{{ eventInfo.nom }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title><strong>Date:</strong></v-list-item-title>
                                <v-list-item-subtitle>{{ transformDate(eventInfo.dataIni) }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title><strong>Place:</strong></v-list-item-title>
                                <v-list-item-subtitle>{{ eventInfo.espai }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item class="my-6">
                            <v-list-item-content>
                                <v-list-item-title><strong>Price:</strong></v-list-item-title>
                                <v-list-item-subtitle>{{ extraerTextoPreu(eventInfo.preu) }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="cancel">Cancel</v-btn>
                        <v-btn @click="buy" :loading="buyLoading" color="success">Buy</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

        </v-container>
    </v-col>
</template>
  
  <!-- =============================== SCRIPTS =============================== -->
  
<script setup>
import axios from "axios";
</script>
  
<script>
export default {
    data() {
        return {
            buyLoading: false,
        };
    },
    props: {
        eventInfo: Object,
    },
    methods: {
        buy() {
            this.$emit("confirmed-buy", this.buyLoading);
        },
        cancel() {
            this.$emit("cancel-buy");
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