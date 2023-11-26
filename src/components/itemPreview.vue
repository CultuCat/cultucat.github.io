<!-- ======================================================================= -->
<!--              COMPONENTE QUE MUESTRA UN PREVIEW DE UN ITEM               -->
<!-- ======================================================================= -->

<template>
  <v-card v-if="item.espai" class="my-3 mx-3" elevation="6" @click.prevent="handleClick('/events/' + item.id)">
    <v-row>
      <v-col cols="1" xl="1" md="2" sm="1">
        <v-avatar :image="item.imatges_list && item.imatges_list.length > 0 ? item.imatges_list[0] : null"
          class="my-2 mx-5" :size="view === 'map' ? '45' : '120'">
        </v-avatar>
      </v-col>
      <v-col cols="11" lg="10" md="9" sm="9">
        <v-card-title>
          <v-btn icon="mdi-chevron-right" variant="plain" :ripple="false" class="pb-1"></v-btn>
          <strong>{{ item.nom }}</strong>
          <p v-if="item.dataIni" class="dates">
            {{ transformDate(item.dataIni) }}
          </p>

          <v-divider></v-divider>
        </v-card-title>

        <v-card-text class="ml-8">
          {{ acortarTexto(item.descripcio) }}
          <br /><br /><strong>{{
            item.preu ? extraerTextoPreu(item.preu) : "Preu no disponible."
          }}</strong>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>

  <v-card v-else class="my-2 mx-3" elevation="4" rounded="xl" :class="getCardClasses()">
    <v-card-item
      @click="handleClick('/users/' + (item.id || item.idUser))"
      class="clickable"
    >
    <template v-slot:prepend>
      <template v-if="view === 'ranking'">
        <strong>{{ index + 1 }}. </strong>   
      </template>
      <v-avatar
        :image="item.imatge || item.avatar"
        size="50"
        class="ml-2 mr-5 my-2"
      ></v-avatar>
      <strong>{{ item.first_name || item.first_name }}</strong>
    </template>
    <template v-slot:append>
      <template v-if="view === 'ranking'">
        Score: {{ item.puntuacio }}
      </template>
        <v-icon>mdi-chevron-right</v-icon>
      </template>

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
      default: "",
    },
      index: Number,
  },
  methods: {
    handleClick(route) {
      window.location.pathname = route;
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
      const maxPalabras=20;
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
    getCardClasses() {
      if (this.view === 'ranking') {
        return {
          'ranking-style': true,
          'first-place': this.isFirst,
          'second-place': this.isSecond,
          'third-place': this.isThird,
        };
      }
      return {}; // Sin clases adicionales si view no es 'ranking'
    },
  },
  computed: {
    isFirst() {
      return this.index === 0;
    },
    isSecond() {
      return this.index === 1;
    },
    isThird() {
      return this.index === 2;
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

.first-place {
  background-color: #ffd700; /* Color para el primer lugar */
}

.second-place {
  background-color: #c0c0c0; /* Color para el segundo lugar */
}

.third-place {
  background-color: #cd7f32; /* Color para el tercer lugar */
}
</style>
