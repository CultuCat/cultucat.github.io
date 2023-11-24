<!-- ======================================================================= -->
<!--                COMPONENTE QUE LISTA EVENTOS DE UN ARRAY                 -->
<!-- ======================================================================= -->

<template>
    <v-col>
      <v-container class="d-flex justify-center align-center">
        <v-col cols="10" md="10" sm="12">
          <template v-if="items.length>0">
  <v-card elevation="4">
            <v-card-item class="my-4">
              
                  
              <template v-slot:prepend v-if="items[0].dataIni">
                <v-btn rounded="xl" prepend-icon="mdi-filter-outline"
                  >Filters</v-btn
                >
              </template>
              <v-text-field
                v-model="searchInput"
                placeholder="Search"
                prepend-inner-icon="mdi-magnify custom-cursor"
                class="expanding-search mx-3 my-1"
                :style="textFieldStyle"
                @focus="expandSearch"
                @blur="expandSearch"
                clearable
                rounded="xl"
                variant="solo"
                density="compact"
                hide-details
              ></v-text-field>
  
              <template v-slot:append v-if="items[0].dataIni && this.view !== 'map'">
                <v-btn
                  rounded="xl"
                  @click="handleBtnClick('/admin/events/create')"
                  >Create Event</v-btn
                >
              </template>
            </v-card-item>
  
            <v-divider class="my-4"></v-divider>
            <v-list v-if="items.length > 0">
              <v-list-item v-for="item in filteredItems" :key="item">
                <v-row justify="space-between" align="center">
                  <v-col cols>
                    <itemPreview :item="item" :view="view"/> 
                  </v-col>
                  <v-col cols="auto" justify="end">
                    <v-btn icon @click="acceptRequest(this.items.find(i => i.from_user == item.id).id)">
                        <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <v-btn icon @click="denyRequest(this.items.find(i => i.from_user == item.id).id)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                
              </v-list-item>
              <div v-if="filteredItems.length === 0" style="text-align: center;" class="my-10">
                <v-chip>
                  Sorry, no results found for your search.
                </v-chip>
              </div>
            </v-list>
          </v-card>
          </template>
          
        </v-col>
      </v-container>
    </v-col>
  </template>
  
  <!-- =============================== SCRIPTS =============================== -->
  
  <script setup>
  import itemPreview from "@/components/requestPreview.vue";
  import addFriend from "@/components/addFriend.vue";
  import { mapGetters} from 'vuex';
  </script>
  
  <script>
  export default {
    data() {
      return {
        tagCategories: ["music", "art", "films", "theatre"],
        expanded: false,
        searchInput: "",
        url:"",
        urlAdd: "",
        users: [],
        userId: "",
      };
    },
    async created() {
      this.url = "https://cultucat.hemanuelpc.es";
      this.userId = this.user.user.id;
      this.urlAdd = `${this.url}/users/${this.userId}/accept_friend_request/`;
      this.users = await this.fetchPendingFriends();
      
    },
    props: {
      items: {
        type: Array,
      },
      view: {
        type: String,
      }
    },
    methods: {
        fetchPendingFriends() {
            return Promise.all(
                this.items.map(request => 
                fetch(`https://cultucat.hemanuelpc.es/users/${request.from_user}`)
                    .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error fetching user with ID ${request.from_user}`);
                    }
                    return response.json();
                    })
                )
            );
        },
        acceptRequest(rid) {
            fetch(this.urlAdd, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "id": rid,
                        "is_accepted": "true",
                    }),
                })
                .then((response) => {
                    if (!response.ok) {
                    throw new Error("No se pudo obtener el archivo JSON");
                    }
                    return response.json();
                })
                .then((data) => {
                    this.response= data;
                    this.urlAdd = data.next;
                })
                .catch((error) => {
                    console.error("Error:", error);
                })
                .finally(() => {
                    //this.isLoading = false; // Restablecer isLoading después de la solicitud, ya sea exitosa o con error
                });
        },
        denyRequest(id) {
            fetch(this.urlAdd, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "id": rid,
                        "is_accepted": "false",
                    }),
                })
                .then((response) => {
                    if (!response.ok) {
                    throw new Error("No se pudo obtener el archivo JSON");
                    }
                    return response.json();
                })
                .then((data) => {
                    this.response= data;
                    this.urlAdd = data.next;
                })
                .catch((error) => {
                    console.error("Error:", error);
                })
                .finally(() => {
                    //this.isLoading = false; // Restablecer isLoading después de la solicitud, ya sea exitosa o con error
                });
        },
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
      ...mapGetters(['user']),
      textFieldStyle() {
        return {
          maxWidth: this.expanded ? "300px" : "45px",
        };
      },
      filteredItems() {
        return this.users
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
    components: {
      itemPreview,
      addFriend,
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
  