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
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title><strong>Discount:</strong></v-list-item-title>
                                <v-select v-if="discounts.length > 0 && filteredDiscounts.length > 0" v-model="selectedDiscount" :items="filteredDiscounts"
                                    :item-props="itemProps" density="compact" label="Choose a discount">
                                </v-select>
                                <v-alert v-else value="true" type="warning" class="mt-2">
                                    No tienes descuentos disponibles.
                                </v-alert>
                            </v-list-item-content>
                        </v-list-item>

                        <v-list-item class="my-6">
                            <v-list-item-content>
                                <v-list-item-title><strong>Total:</strong></v-list-item-title>
                                <v-list-item-subtitle>{{ calculateTotalPrice }}</v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="cancel">Cancel</v-btn>
                        <v-btn @click="buy(selectedDiscount)" :loading="buyLoading" color="success">Buy</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

        </v-container>
    </v-col>
</template>
  
  <!-- =============================== SCRIPTS =============================== -->
  
<script>
export default {
    data() {
        return {
            selectedDiscount: null,
        };
    },
    props: {
        eventInfo: Object,
        discounts: Array,
        buyLoading: Boolean,
    },
    methods: {
        buy(selectedDiscount) {
            if(selectedDiscount != null){
                this.$emit("confirmed-buy", true, selectedDiscount.codi);
            }
            else{
               this.$emit("confirmed-buy", true, null); 
            }
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
        itemProps(item) {
            return {
                title: this.calculateDiscountPercentage(item.nivellTrofeu) + '%',
                subtitle: item.codi,
            }
        },
        calculateDiscountPercentage(nivellTrofeu) {
            switch (nivellTrofeu) {
                case 1:
                    return '10';
                case 2:
                    return '20';
                case 3:
                    return '30';
                default:
                    return '';
            }
        },
    },
    computed: {
        filteredDiscounts() {
            return this.discounts.filter(discount => !discount.usat);
        },
        calculateTotalPrice() {
            if (this.selectedDiscount) {
                const discountPercentage = this.calculateDiscountPercentage(this.selectedDiscount.nivellTrofeu);
                const originalPriceText = this.extraerTextoPreu(this.eventInfo.preu);

                // Extraer el valor numérico del texto con el signo de euro
                const originalPrice = parseFloat(originalPriceText);

                if (!isNaN(originalPrice)) {
                    const discountedPrice = originalPrice - (originalPrice * discountPercentage) / 100;
                    return discountedPrice.toFixed(2) + '€'; // Ajusta el formato según tu necesidad
                } else {
                    // Si no se pudo extraer un número válido, mostrar el texto original
                    return originalPriceText;
                }
            } else {
                // Si no hay descuento seleccionado, mostrar el precio original
                return this.extraerTextoPreu(this.eventInfo.preu);
            }
        },
    },
};
</script>