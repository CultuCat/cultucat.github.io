<!-- ======================================================================= -->
<!--            COMPONENTE QUE MUESTRA LOS TAGS DE CADA CATEGORÍA            -->
<!-- ======================================================================= -->

<template>
  <v-row justify="center">
    <v-col cols="8" md="8" sm="5">
      <v-sheet>
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
              {{ tag }}
              <v-icon
                class="ml-1"
                v-if="showDeleteIcon === index && !trophyTab"
                @click="emitDeleteItem(index)"
              >
                mdi-delete
              </v-icon>
            </v-btn>
          </v-slide-group-item>
        </v-slide-group>

        <v-chip v-else>
          There aren't any {{ compData.title.toLowerCase() }}. Try adding new
          ones!
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
    emitDeleteItem(index) {
      const chipName = this.compData.arr[index];
      const chipCat = this.compData.title;
      this.$emit("delete-item", { index, chipName, chipCat });
    },
  },
};
</script>
