<template>
  <v-col>
    <v-container class="d-flex justify-center align-center">
      <v-col cols="12">
        <template v-if="loaded">
          <div v-if="items_get.length === 0" style="text-align: center;">
            <v-chip class="mr-2"> Sorry, no results found. </v-chip>
          </div>
          <v-card v-else elevation="4">
            <v-card-item class="my-4">
              <template v-slot:prepend v-if="items_get[0]?.dataIni">
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
                <eventPreview v-if="item.espai" :item="item" />
                <userPreview v-else :item="item" :index="index" :isAdmin="isAdmin" @update="getUsers" />
              </v-list-item>
              <div v-if="filteredItems.length === 0" style="text-align: center" class="my-10">
                <v-chip> Sorry, no results found for your search. </v-chip>
              </div>
            </v-list>
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
        {title: 'Date', value: "-dataIni"},
        {title: 'Name', value: "-nom"},
        {title: 'Price', value: "-preu"},
        {title: 'Places', value: "-espai"},
      ],
      orderBySelected: 0,
      loadingOrder: false,
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
          console.log(url);
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
