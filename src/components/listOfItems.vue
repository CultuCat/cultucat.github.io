<!-- ======================================================================= -->
<!--                COMPONENTE QUE LISTA EVENTOS DE UN ARRAY                 -->
<!-- ======================================================================= -->

<template>
  <v-col>
    <v-container class="d-flex justify-center align-center">
      <v-col cols="10" md="10" sm="12">
        <template v-if="items != null">
          <v-card elevation="4">
            <v-card-item class="my-4">


              <template v-slot:prepend v-if="items[0].dataIni">
                <v-btn rounded="xl" prepend-icon="mdi-filter-outline">Filters</v-btn>
              </template>
              <v-text-field v-model="searchInput" placeholder="Search" prepend-inner-icon="mdi-magnify custom-cursor"
                class="expanding-search mx-3 my-1" :style="textFieldStyle" @focus="expandSearch" @blur="expandSearch"
                clearable rounded="xl" variant="solo" density="compact" hide-details></v-text-field>

              <template v-slot:append v-if="items[0].dataIni && this.user.user.is_staff">
                <v-btn rounded="xl" @click="handleBtnClick('/admin/events/create')">Create Event</v-btn>
              </template>
            </v-card-item>

            <v-divider class="my-4"></v-divider>
            <v-list-item v-for="item in filteredItems" :key="item">
              <itemPreview :item="item" />
            </v-list-item>
            <div v-if="filteredItems.length === 0" style="text-align: center;" class="my-10">
              <v-chip>
                Sorry, no results found for your search.
              </v-chip>
            </div>
          </v-card>
        </template>

      </v-col>
    </v-container>
  </v-col>
</template>

<!-- =============================== SCRIPTS =============================== -->

<script setup>
import itemPreview from "@/components/itemPreview.vue";
import { integer } from "@vuelidate/validators";
</script>

<script>
export default {
  data() {
    return {
      expanded: false,
      searchInput: "",
    };
  },
  props: {
    items: {
      type: Array,
    },
  },
  methods: {
    expandSearch() {
      if (this.searchInput) {
        this.searchInput = "";
      }
      this.expanded = !this.expanded;
    },
    handleBtnClick(route) {
      this.$router.push(route);
    },
  },
  computed: {
    textFieldStyle() {
      return {
        maxWidth: this.expanded ? "300px" : "45px",
      };
    },
    filteredItems() {
      return this.items
        .filter((item) => {
          if (!this.searchInput) return true;
          const searchInput = this.searchInput.toLowerCase();

          const indicesToSearch = [1, 2];

          for (const index of indicesToSearch) {
            const key = Object.keys(item)[index];
            if (item[key] && item[key].toString().toLowerCase().includes(searchInput)) {
              return true;
            }
          };
          return false;
    })
        .sort((a, b) => {
      if (a.first_name && b.first_name) {
        return a.first_name.localeCompare(b.first_name);
      }
      return 0;
    });
  },
},
components: {
  itemPreview,
  },
};
</script>

<!-- =============================== ESTILOS =============================== -->

<style scoped>
.expanding-search {
  transition: max-width 0.3s;
}
</style>

<style lang="sass">
.v-input.expanding-search
  .v-field
      cursor: pointer !important
</style>
