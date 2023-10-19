<!-- ======================================================================= -->
<!--            COMPONENTE QUE MUESTRA LOS TAGS DE CADA CATEGORÍA            -->
<!-- ======================================================================= -->

<template>
  <v-sheet class="d-inline-block" max-width="700">
    <v-slide-group show-arrows v-if="compData.arr.length !== 0" center-active>
      <v-slide-group-item
        v-for="tag in compData.arr"
        :key="tag"
        v-slot="{ isSelected, toggle }"
      >
        <v-btn
          class="ma-2"
          rounded
          :color="isSelected ? 'primary' : undefined"
          @click="toggle"
        >
          {{ tag }}
        </v-btn>
      </v-slide-group-item>
    </v-slide-group>

    <v-chip v-else>
      There aren't any {{ compData.title.toLowerCase() }}. Try adding new ones!
    </v-chip>
  </v-sheet>
</template>

<!-- =============================== SCRIPTS =============================== -->

<script>
export default {
  props: {
    compData: Object, //Recibe datos de la vista padre
  },
};
</script>
