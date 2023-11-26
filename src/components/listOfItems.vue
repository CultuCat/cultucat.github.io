<!-- ======================================================================= -->
<!--                COMPONENTE QUE LISTA EVENTOS DE UN ARRAY                 -->
<!-- ======================================================================= -->

<template>
  <v-col>
    <v-container class="d-flex justify-center align-center">
      <v-col cols="10" md="10" sm="12">
        <template v-if="loaded">
          <template v-if="items_get.length === 0">
            <div style="text-align: center;">
              <v-chip class="mr-2"> Sorry, no results found. </v-chip>
            </div>
          </template>
          <template v-else>
            <v-card elevation="4">
              <v-card-item class="my-4">
                <template v-slot:prepend v-if="items_get[0]?.dataIni">
                  <v-btn rounded="xl" prepend-icon="mdi-filter-outline">Filters</v-btn>
                </template>
                <v-text-field v-model="searchInput" placeholder="Search" prepend-inner-icon="mdi-magnify custom-cursor"
                  class="expanding-search mx-3 my-1" :style="textFieldStyle" @focus="expandSearch" @blur="expandSearch"
                  clearable rounded="xl" variant="solo" density="compact" hide-details></v-text-field>

              <template v-slot:append v-if="view === 'admin_events'">
                <v-btn rounded="xl" @click="handleBtnClick('/admin/events/create')">+ Create Event</v-btn>
              </template>
            </v-card-item>

              <v-divider class="my-4"></v-divider>
              <v-list v-if="items_get.length > 0">
                <v-list-item v-for="(item, index) in filteredItems" :key="item">
                  <itemPreview :item="item" :index="index" :view="view"/>
                </v-list-item>
                <div v-if="filteredItems.length === 0" style="text-align: center" class="my-10">
                  <v-chip> Sorry, no results found for your search. </v-chip>
                </div>
              </v-list>
            </v-card>
          </template>
        </template>

      </v-col>
    </v-container>
  </v-col>
</template>

<!-- =============================== SCRIPTS =============================== -->

<script setup>
import itemPreview from "@/components/itemPreview.vue";
import axios from "axios";
</script>

<script>
export default {
  data() {
    return {
      items_get: [],
      expanded: false,
      searchInput: "",
      loaded: false,
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
    getUsers() {
      axios
        .get("https://cultucat.hemanuelpc.es/users/")
        .then((response) => {
          if (response.status === 200) {
            this.items_get = response.data;
            this.loaded = true;
          }
        })
        .catch((error) => {
          // Maneja errores aquí
          console.error("Error al obtener los usuarios:", error);
        });
    },
    getFriends() {
      axios
        .get("https://cultucat.hemanuelpc.es/users/"  + this.userId +  "/")
        .then((response) => {
          if (response.status === 200) {
            this.items_get = response.data.friends;
            this.loaded = true;
          }
        })
        .catch((error) => {
          // Maneja errores aquí
          console.error("Error al obtener los usuarios:", error);
        });
    },
    getEvents() {
      axios
        .get("https://cultucat.hemanuelpc.es/events/?ordering=-dataIni")
        .then((response) => {
          if (response.status === 200) {
            this.items_get = response.data.results;
            this.loaded = true;
          }
        })
        .catch((error) => {
          // Maneja errores aquí
          console.error("Error al obtener los eventos:", error);
        });
    },
  },
  created() {
    if(this.items){
      this.items_get = this.items;
      this.loaded = true;
    }
    else {
      if (this.type === "ranking" || this.type === "list_users") {
      this.getUsers();
    } else if (this.type === "list_friends") {
      this.getFriends();
    } else if (this.type === "list_events") {
      this.getEvents();
    } else {
      console.log("Error: type not found");
    }
    }
    
  },
  computed: {
    textFieldStyle() {
      return {
        maxWidth: this.expanded ? "300px" : "45px",
      };
    },
    filteredItems() {
      this.items_get = this.items ? this.items : this.items_get;
      return this.items_get
        .filter((item) => {
          if (!this.searchInput) return true;
          const searchInput = this.searchInput.toLowerCase();

          for (const key in item) {
            if (
              item[key] &&
              item[key].toString().toLowerCase().includes(searchInput)
            ) {
              return true;
            }
          }

          return false;
        })
        .sort((a, b) => {
          if (this.type === "ranking") {
            return b.puntuacio - a.puntuacio;
          } else if (a.first_name && b.first_name) {
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
