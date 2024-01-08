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
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-col cols="8">
                <strong>{{ this.$t('EVENT.Data_inicial') }}:</strong>
                {{
                  datesSelected.start
                  ? new Date(datesSelected.start)
                    .toLocaleDateString()
                    .replace(/\//g, "-")
                  : this.$t('EVENT.No_seleccionada')
                }}
              </v-col>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-date-picker v-model="datesSelected.start" color="#FF6961" class="ma-auto" :locale="es"
                :header="this.$t('EVENT.Data_inicial')" :title="this.$t('EVENT.Selecciona_data')"></v-date-picker>
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-col cols="8">
                <strong>{{ this.$t('EVENT.Data_final') }}:</strong>
                {{
                  datesSelected.end
                  ? new Date(datesSelected.end)
                    .toLocaleDateString()
                    .replace(/\//g, "-")
                  : this.$t('EVENT.No_seleccionada')
                }}
              </v-col>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-date-picker v-model="datesSelected.end" :min="datesSelected.start" color="#FF6961" class="ma-auto"
                :locale="es - ES" landscape="true" :header="this.$t('EVENT.Data_final')"
                :title="this.$t('EVENT.Selecciona_data')"></v-date-picker>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-btn class="text-none" rounded variant="flat" @click="filterBy"
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
    };
  },
  props: {
    idxTagsProp: Array,
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
      const formattedDates = {
        start: this.datesSelected.start ? new Date(this.datesSelected.start)
          .toLocaleDateString()
          .replace(/\//g, "-") : null,
        end: this.datesSelected.end ? new Date(this.datesSelected.end)
          .toLocaleDateString()
          .replace(/\//g, "-") : null,
      };
      this.$emit("filter-by", { filterTags, idxTags, formattedDates });
    },
  },
  mounted() {
    this.getTags();
    this.tagsSelected = this.idxTagsProp;
  },
};
</script>
