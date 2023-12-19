<template>
  <v-col>
    <v-container class="d-flex justify-center align-center">
      <v-col cols="12">
        <template v-if="loaded">
          <v-card elevation="4">
            <v-card-item class="my-4">
              <template v-slot:prepend v-if="view === 'events'">
                <v-btn rounded="xl" prepend-icon="mdi-filter-outline">Filters</v-btn>
                <v-menu location="end">
                  <template v-slot:activator="{ props }">
                    <v-btn dark v-bind="props" icon="mdi-swap-vertical" size="35" class="ml-4" :loading="loadingOrder">
                    </v-btn>
                  </template>
                  <v-list v-model="orderBySelected">
                    <v-list-item v-for="(item, index) in orderByList" :key="index" :value="index" @click="sortBy(index)">
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
              <v-text-field v-model="searchInput" placeholder="Search"
                :prepend-inner-icon="!expanded ? 'mdi-magnify custom-cursor' : null" class="expanding-search mx-3 my-1"
                :style="textFieldStyle" @focus="expandSearch" @blur="expandSearch" clearable rounded="xl" variant="solo"
                density="compact" hide-details @keyup.enter="search"
                @click:clear="items_get = items">
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
                <v-btn rounded="xl"  variant="plain" icon="mdi-restart" @click="items_get = items"></v-btn>
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
</template>

<script>
import eventPreview from "@/components/eventPreview.vue";
import userPreview from "@/components/userPreview.vue";

export default {
  name: "listOfItems",
  components: {
    eventPreview,
    userPreview,
  },
  data() {
    return {
      items_get: [],
      expanded: false,
      searchInput: "",
      loaded: false,
      orderByList:[
        {title: 'Ascending Date', value: "dataIni"},
        {title: 'Descending Date', value: "-dataIni"},
        {title: 'Ascending Name', value: "nom"},
        {title: 'Descending Name', value: "-nom"},
      ],
      orderBySelected: 1,
      loadingOrder: false,
      ordered: false,
      searchMade: false,
      searching: false,
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
    sortBy(index){
      const selected = this.orderByList[index].value;
      if(selected !== this.orderByList[this.orderBySelected].value){
        this.orderBySelected = index;
        this.ordered  = true;
        this.getEvents(selected);
      }
    },
    getEvents(param) {
      let ordering = "-dataIni";
      if (param){
        ordering = param;
        this.loadingOrder = true;
      }
      const url = `https://cultucat.hemanuelpc.es/events/?ordering=${ordering}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error al obtener los eventos: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          this.items_get = data.results;
          this.loaded = true;
          this.loadingOrder = false;
        })
        .catch((error) => {
          console.error(error);
        });
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
      return  (this.items && !this.searchMade && !this.ordered) ? this.items : this.items_get;
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
