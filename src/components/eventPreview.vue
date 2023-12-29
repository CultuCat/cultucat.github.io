<template>
  <v-card class="my-3 mx-3 pa-2" elevation="6" @click.prevent="handleClick('/events/', item.id)">
    <v-row>
      <v-col :cols="isSmall ? '3' : '2'" class="d-flex align-center">
        <v-img v-if="item.imatges_list?.length > 0" :src="item.imatges_list[0]" :alt="item.nom" class="ma-2" cover
          aspect-ratio="1" style="border-radius: 5px;" width="125px" />
      </v-col>
      <template v-if="!isSmall">
        <v-col cols="10">
          <v-card-title style="overflow: hidden;">
            <strong>{{ item.nom }}</strong>
            <p v-if="item.dataIni" class="dates">{{ transformDate(item.dataIni) }}</p>
            <p v-if="item.espai" class="dates">{{ item.espai.nom }}</p>
          </v-card-title>
          <v-divider class="mr-2" />
          <v-card-text>
            {{ acortarTexto(item.descripcio) }}
            <br /><br />
            <strong>{{ isNumber(item.preu) ? `Preu: ${item.preu} €` : item.preu }}</strong>
          </v-card-text>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="9">
          <v-card-title>
            <strong>{{ item.nom }}</strong>
          </v-card-title>
          <v-card-text>
            <p v-if="item.dataIni">{{ transformDate(item.dataIni) }}</p>
            <p v-if="item.espai">{{ item.espai.nom }}</p>
            <strong>{{ isNumber(item.preu) ? `Preu: ${item.preu} €` : item.preu }}</strong>
          </v-card-text>
        </v-col>
      </template>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
    },
    isSmall: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    handleClick(path, id) {
      window.location.pathname = path + id;
    },
    transformDate(date) {
      const dateObj = new Date(date);
      const formatOptions = {
        weekday: "short",
        month: "long",
        day: "numeric",
      };
      const formatter = new Intl.DateTimeFormat("en-US", formatOptions);
      return formatter.format(dateObj);
    },
    acortarTexto(texto) {
      if (!texto) return null;
      const palabras = texto.split(" ");
      const maxPalabras = 25;
      if (palabras.length > maxPalabras) {
        const textoAcortado = palabras.slice(0, maxPalabras).join(" ");
        return textoAcortado + "...";
      }
      return texto;
    },
    isNumber(value) {
      if (!value) return value;
      value = value.replace(',', '.');
      return !isNaN(Number(value)) && !isNaN(parseFloat(value));
    },
  },
};
</script>

<style scoped>
.dates {
  display: inline-block;
  margin-left: 1rem;
  font-size: 0.6em;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
}
</style>
