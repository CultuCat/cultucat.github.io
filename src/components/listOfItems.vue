<template>
  <v-col>
    <v-container class="d-flex justify-center align-center">
      <v-col cols="12">
        <template v-if="loaded">
          <v-card elevation="4">
            <v-card-item class="my-4">
              <template v-slot:prepend v-if="view === 'events'">
                <v-btn rounded="xl" prepend-icon="mdi-filter-outline" @click="filtersDialog = true" :loading="filtering">Filters</v-btn>
              </template>
              <v-text-field v-model="searchInput" placeholder="Search"
                :prepend-inner-icon="!expanded ? 'mdi-magnify custom-cursor' : null" class="expanding-search mx-3 my-1"
                :style="textFieldStyle" @focus="expandSearch" @blur="expandSearch" clearable rounded="xl" variant="solo"
                density="compact" hide-details @keyup.enter="search" @click:clear="items_get = items">
                <template v-slot:append-inner v-if="expanded">
                  <v-btn :loading="searching" @click="search" variant="plain" rounded="xl" :ripple="false">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </template>
              </v-text-field>

              <template v-slot:append v-if="view === 'admin_events'">
                <v-btn rounded="xl" @click="handleBtnClick('/admin/events/create')">+ Create Event</v-btn>
              </template>
              <template v-slot:append v-else>
                <v-btn rounded="xl" variant="plain" icon="mdi-restart" @click="items_get = items"></v-btn>
              </template>
            </v-card-item>

            <v-divider class="my-4"></v-divider>
            <v-list v-if="items_get.length > 0">
              <v-list-item v-for="(item, index) in filteredItems" :key="item">
                <eventPreview v-if="item.espai" :item="item" />
                <userPreview v-else :item="item" :index="index" :isAdmin="isAdmin" @update="getUsers" />
              </v-list-item>
            </v-list>
            <div v-else style="text-align: center" class="my-10">
              <v-chip> Sorry, no results found for your search. </v-chip>
            </div>
          </v-card>
        </template>
      </v-col>
    </v-container>
  </v-col>
  <v-dialog v-model="filtersDialog">
    <eventsFilters @quit-filters-dialog="filtersDialog = false" @filter-by="filterByEvent" />
  </v-dialog>
</template>

<script>
import eventPreview from "@/components/eventPreview.vue";
import userPreview from "@/components/userPreview.vue";
import eventsFilters from "@/components/eventsFilters.vue";

export default {
  name: "listOfItems",
  components: {
    eventPreview,
    userPreview,
    eventsFilters,
  },
  data() {
    return {
      items_get: [],
      expanded: false,
      searchInput: "",
      loaded: false,
      searchMade: false,
      searching: false,
      filtersDialog: false,
      filtered: false,
      filtering: false,
    };
  },
  props: {
    items: {
      type: Array,
    },
    type: String,
    userId: Number,
    view: String
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
    search() {
      if (this.searchInput) {
        const searchQuery = this.searchInput.toLowerCase();
        this.searching = true;
        fetch("https://cultucat.hemanuelpc.es/events/?query=" + searchQuery)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Error al obtener los usuarios: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            this.items_get = data.results;
            this.loaded = true;
            this.searchMade = true;
            this.searching = false;
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    getUsers() {
      fetch("https://cultucat.hemanuelpc.es/users/")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error al obtener los usuarios: ${response.status}`);
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
    getEvents(filterTags) {
      let params = "ordering=-dataIni";
      if (this.filtered && filterTags.length > 0) {
        params = "";
        filterTags.forEach((fTag, index) => {
          params += ("tag=" + fTag.id);
          if (index < filterTags.length - 1) params += "&";
        })
        this.filtering=true;
      }
      fetch("https://cultucat.hemanuelpc.es/events/?" + params)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error al obtener los eventos: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          this.items_get = data.results;
          this.loaded = true;
          this.filtering=false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    filterByEvent(filterTags) {
      this.filtered = true;
      this.filtersDialog = false;
      console.log(filterTags);
      this.getEvents(filterTags);
    }
  },
  created() {
    if (this.items) {
      this.items_get = this.items;
      this.loaded = true;
    }
    else {
      if (this.type === "list_users") {
        this.getUsers();
      } else if (this.type === "list_events") {
        this.getEvents();
      }
    }
  },
  computed: {
    textFieldStyle() {
      return {
        maxWidth: this.expanded ? "300px" : "45px",
      };
    },
    isAdmin() {
      return this.view === 'admin_users';
    },
    filteredItems() {
      this.items_get = (this.items && !this.filtered) ? this.items : this.items_get;
      return this.items_get
        .sort((a, b) => {
          if (a.first_name && b.first_name) {
            return a.first_name.localeCompare(b.first_name);
          }
          return 0;
        });
    },
  },
};
</script>

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
