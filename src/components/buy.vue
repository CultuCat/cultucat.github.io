<!-- ======================================================================= -->
<!--                COMPONENTE QUE LISTA EVENTOS DE UN ARRAY                 -->
<!-- ======================================================================= -->

<template>
    <v-card elevation="4">
        <v-toolbar color="#ff6961" dark>
            <v-icon size="35" class="ml-6">mdi-ticket</v-icon>
            <v-toolbar-title>{{$t('EVENT.Resum_compra')}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
                <v-btn icon dark variant="plain" @click="cancel">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>
        <v-card-text>
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title><strong>{{$t('EVENT.Name')}}:</strong></v-list-item-title>
                        <v-list-item-subtitle>{{ eventInfo.nom }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title><strong>{{$t('EVENT.Data')}}:</strong></v-list-item-title>
                        <v-list-item-subtitle>{{ transformDate(eventInfo.dataIni) }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title><strong>{{$t('EVENT.Lloc')}}:</strong></v-list-item-title>
                        <v-list-item-subtitle>{{ eventInfo.espai }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title><strong>{{$t('EVENT.Preu')}}:</strong></v-list-item-title>
                        <v-list-item-subtitle>{{ eventInfo.preu == "Gratuït" ? "Gratuït" : eventInfo.preu +
                            ' €' }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="eventInfo.preu != 'Gratuït'">
                    <v-list-item-content>
                        <v-list-item-title><strong>{{$t('EVENT.Descompte')}}:</strong></v-list-item-title>
                        <v-select v-if="discounts.length > 0 && filteredDiscounts.length > 0" v-model="selectedDiscount"
                            :items="filteredDiscounts" :item-props="itemProps" density="compact" :label="$t('EVENT.Chose_discount')"
                            clearable>
                        </v-select>
                        <v-alert v-else value="true" type="warning" class="mt-2">
                            {{$t('EVENT.No_descompte')}}
                        </v-alert>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="eventInfo.preu != 'Gratuït'" class="mt-0">
                    <v-list-item-content>
                        <v-list-item-title><strong>{{$t('EVENT.Total')}}:</strong></v-list-item-title>
                        <v-list-item-subtitle>{{ isNaN(calculateTotalPrice) ? "Non price" : calculateTotalPrice + ' €'
                        }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="cancel">{{$t('cancel')}}</v-btn>
            <v-btn @click="buy(selectedDiscount)" :loading="buyLoading" color="success">{{$t('EVENT.Buy')}}</v-btn>
        </v-card-actions>
    </v-card>
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
            if (selectedDiscount != null) {
                this.$emit("confirmed-buy", true, selectedDiscount.codi);
            }
            else {
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
            const formatter = new Intl.DateTimeFormat(`${this.$t('data')}`, formatOptions);
            return formatter.format(dateObj);
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
            let finalPrice;

            if (this.selectedDiscount) {
                const discountPercentage = this.calculateDiscountPercentage(this.selectedDiscount.nivellTrofeu);
                const originalPrice = parseFloat(this.eventInfo.preu);

                if (!isNaN(originalPrice)) {
                    const discountedPrice = originalPrice - (originalPrice * discountPercentage) / 100;
                    finalPrice = parseFloat(discountedPrice.toFixed(2));
                } else {
                    // Si no se pudo extraer un número válido, mostrar el precio original
                    finalPrice = NaN;
                }
            } else {
                // Si no hay descuento seleccionado, mostrar el precio original
                finalPrice = parseFloat(this.eventInfo.preu);
            }

            return finalPrice;
        }
    },
};
</script>