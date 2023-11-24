<!-- ======================================================================= -->
<!--              COMPONENTE QUE MUESTRA UN PREVIEW DE UN ITEM               -->
<!-- ======================================================================= -->

<template>
  
  <v-card  class="my-2 mx-3" elevation="4" rounded="xl">
    <v-card-item
      @click="handleClick('/users/' + this.item.id)"
      class="clickable"
      append-icon="mdi-chevron-right"
    >
      <v-avatar
        :image="item.imatge"
        size="50"
        class="ml-2 mr-5 my-2"
      ></v-avatar>
      <strong>{{ item.first_name }}</strong>
    </v-card-item>
  </v-card>
</template>

<!-- =============================== SCRIPTS =============================== -->

<script>
export default {
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
    },
    view: {
      type: String,
    },
  },
  methods: {
    handleClick(route) {
      this.$router.push(route);
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
    acortarTexto(texto) {
      const palabras = texto.split(" ");
      const maxPalabras = 20;
      if (palabras.length > maxPalabras) {
        const textoAcortado = palabras.slice(0, maxPalabras).join(" ");
        return textoAcortado + "...";
      }
      return texto;
    },
    extraerTextoPreu(texto) {
      // Utilizamos una expresión regular para buscar la parte deseada del texto
      const regex = /Preus?[^€]*€/;
      const match = texto.match(regex);
      return match ? match[0] : texto;
    },
  },
};
</script>

<!-- =============================== ESTILOS =============================== -->

<style scoped>
.clickable:hover {
  cursor: pointer;
}

.dates {
  display: inline-block;
  font-size: 0.6em;
  margin-left: 1rem;
}
</style>
