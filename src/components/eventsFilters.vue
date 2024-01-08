<template>
  <v-card class="mx-auto" min-width="400" max-width="700">
    <v-toolbar flat color="#ff6961" dark>
      <v-btn icon @click="quitFiltersDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{ $t("EVENT.Filtrar_res") }}</v-toolbar-title>
    </v-toolbar>
    <template v-if="loading">
      <v-progress-linear indeterminate class="mb-4"></v-progress-linear>
    </template>
    <template v-else>
      <v-card-text>
        <h2 class="text-h6 mb-2">
          {{ $t("EVENT.Tags") }}
        </h2>
        <v-chip-group v-model="tagsSelected" column multiple>
          <v-chip v-for="(tag, idx) in tags" :key="idx" filter variant="outlined">
            {{
              tag.nom.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())
            }}
          </v-chip>
        </v-chip-group>
        <v-divider class="my-5"></v-divider>
        <h2 class="text-h6 mb-2">
          {{ $t("EVENT.Dates") }}
        </h2>
        <v-text-field class="mb-2" type="date" label="Data Inici" v-model="datesSelected.start" clearable
          :rules="[rules.data]" variant="outlined" />
        <v-text-field class="mb-2" type="date" label="Data Fi" v-model="datesSelected.end" clearable
          :rules="[rules.data, rules.dataFi]" variant="outlined" />
      </v-card-text>
      <v-btn class="text-none" rounded variant="flat" @click="filterBy" :disabled="this.dateError"
        style="position: absolute; top: 15px; right: 15px; background-color: white;">
        {{ $t("EVENT.Filtrar") }}
      </v-btn>
    </template>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      tagsSelected: [],
      datesSelected: {
        start: null,
        end: null,
      },
      tags: [],
      loading: false,
      rules: {
        data: v => !!v || "Data no pot se buida",
        dataFi: v => {
          if (this.datesSelected.start) {
            return new Date(this.datesSelected.start) < new Date(v) || "La data de finalització no pot ser anterior a la de inici";
          }
          return true;
        },
      },
      dateError: false,
    };
  },
  props: {
    idxTagsProp: Array,
    datesSelectedProp: Object,
  },
  methods: {
    getTags() {
      this.loading = true;
      fetch("https://cultucat.hemanuelpc.es/tags/")
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error al obtener los usuarios: ${response.status}`
            );
          }
          return response.json();
        })
        .then((data) => {
          this.tags = data;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getSpaces() {
      fetch("https://cultucat.hemanuelpc.es/spaces/")
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Error al obtener los usuarios: ${response.status}`
            );
          }
          return response.json();
        })
        .then((data) => {
          this.items_get = data;
          this.loaded = true;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    quitFiltersDialog() {
      this.$emit("quit-filters-dialog");
    },
    filterBy() {
      let filterTags = this.tags.filter((tag) => {
        const indiceEnTagsSelected = this.tagsSelected.findIndex(
          (obj) => obj === tag.id - 1
        );
        return indiceEnTagsSelected !== -1;
      });
      const idxTags = this.tagsSelected;
      const formattedDates = this.datesSelected;
      this.$emit("filter-by", { filterTags, idxTags, formattedDates });
    },
    checkDates() {
      const start = this.datesSelected.start ? new Date(this.datesSelected.start) : null;
      const end = this.datesSelected.end ? new Date(this.datesSelected.end) : null;

      this.dateError = start && end ? start > end : false;
    },
    formatDate(fecha) {
      if (fecha != null) {
        var date = new Date(fecha);

        var año = date.getFullYear();
        var mes = ('0' + (date.getMonth() + 1)).slice(-2);
        var día = ('0' + date.getDate()).slice(-2);

        return año + '-' + mes + '-' + día;
      }
      return null;
    }
  },
  mounted() {
    this.getTags();
    this.tagsSelected = this.idxTagsProp;
    this.datesSelected.start = this.formatDate(this.datesSelectedProp.start);
    this.datesSelected.end = this.formatDate(this.datesSelectedProp.end);
    console.log(this.datesSelected);
  },
  watch: {
    'datesSelected.start': 'checkDates',
    'datesSelected.end': 'checkDates',
  },
};
</script>
