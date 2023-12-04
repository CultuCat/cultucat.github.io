<!-- ======================================================================= -->
<!--            COMPONENTE QUE MUESTRA LOS ITEMS DE CADA CATEGORÍA            -->
<!-- ======================================================================= -->

<template>
  <v-row justify="center">
    <v-col cols="10" sm="10">
      <v-sheet class="d-flex justify-center align-center">
        <v-slide-group show-arrows v-if="compData.arr.length !== 0" center-active>
          <v-slide-group-item v-for="(item, index) in compData.arr" :key="item">
            <v-btn class="ma-2" 
            rounded
            :style="{
              backgroundColor: trophyTab ? getBackgroundColor(item.level_achived_user) : '',
              color: trophyTab ? getTextColor(item.level_achived_user) : ''
            }" @mouseenter="showDeleteIcon = index" @mouseleave="showDeleteIcon = -1">
              <v-icon class="mr-1" v-if="trophyTab && item.level_achived_user === 1">
                mdi-trophy-variant
              </v-icon>
              <v-icon class="mr-1" v-else-if="trophyTab && item.level_achived_user === 2">
                mdi-trophy-outline
              </v-icon>
              <v-icon class="mr-1" v-else-if="trophyTab && item.level_achived_user === 3">
                mdi-trophy-award
              </v-icon>
              {{ item.nom }}
              <v-icon class="ml-1" v-if="showDeleteIcon === index && !trophyTab" @click="emitDeleteItem(index, item.id)">
                mdi-delete
              </v-icon>
            </v-btn>
          </v-slide-group-item>
        </v-slide-group>

        <v-chip v-else>
          <template v-if="!trophyTab">
            There aren't any {{ compData.title.toLowerCase() }}. Try adding new
            ones!
          </template>
          <template v-else>
            There aren't any {{ compData.title.toLowerCase() }}. Go win some!
          </template>
        </v-chip>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<!-- =============================== SCRIPTS =============================== -->

<script>
export default {
  data() {
    return {
      showDeleteIcon: -1,
      trophyTab: this.compData.title === "Trophies",
    };
  },
  props: {
    compData: Object, //Recibe datos de la vista padre
  },
  methods: {
    emitDeleteItem(index, id) {
      const chipName = this.compData.arr[index];
      const chipCat = this.compData.title;
      this.$emit("delete-item", { index, chipName, chipCat, id });
    },
    getBackgroundColor(nivell) {
      const colorMap = {
        1: '#CD7F32', // Bronce
        2: '#C0C0C0', // Plata
        3: '#FFD700', // Oro
      };
      return colorMap[nivell] || ''; // Devuelve el color correspondiente o una cadena vacía si no hay coincidencia.
    },
    getTextColor(nivell) {
      const textColorMap = {
        1: '#FFFFFF', // Texto blanco para bronce
        2: '#000000', // Texto negro para plata
        3: '#000000', // Texto negro para oro
        // Puedes ajustar los colores según tus preferencias
      };

      return textColorMap[nivell] || ''; // Devuelve el color de texto correspondiente o una cadena vacía si no hay coincidencia.
    },
  },
};
</script>
