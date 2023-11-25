<!-- ======================================================================= -->
<!--            COMPONENTE QUE MUESTRA LOS TAGS DE CADA CATEGORÍA            -->
<!-- ======================================================================= -->

<template>
  <v-row justify="center">
    <v-col cols="10" sm="10">
      <v-sheet class="d-flex justify-center align-center">
        <v-slide-group
          show-arrows
          v-if="compData.arr.length !== 0"
          center-active
          

        >
          <v-slide-group-item v-for="(tag, index) in compData.arr" :key="tag">
            <v-btn
              class="ma-2"
              rounded
              @mouseenter="showDeleteIcon = index"
              @mouseleave="showDeleteIcon = -1"
            >
              {{ tag.nom }}
              <v-icon
                class="ml-1"
                v-if="showDeleteIcon === index && !trophyTab"
                @click="emitDeleteItem(index, tag.id)"
              >
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
  },
};
</script>
