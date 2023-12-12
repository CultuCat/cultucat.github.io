<!-- ======================================================================= -->
<!--                        VISTA PERFIL DEL USUARIO                         -->
<!-- ======================================================================= -->

<template>
  <template v-if="profile.imatge != undefined">
    <v-col>
      <h1 style="color: #ff6961" class="my-5 ml-5">Profile</h1>

      <v-container class="d-flex justify-center align-center">
        <v-col cols="12">
          <template v-if="loadingUser == true">
            <v-card :loading="loadingUser">
              <v-card-text>Loading...</v-card-text>
            </v-card>
          </template>
          <template v-else>
            <!-- ========================== AVATAR Y SETTINGS ========================== -->
            <v-card>
              <!-- ============================= SLOTS V-CARD ============================== -->

              <template v-slot:prepend>
                <v-avatar :image="profile.imatge" size="70"></v-avatar>
              </template>

              <template v-slot:title>
                {{ profile.first_name }}
                <v-icon icon="mdi-check-decagram" size="xs" class="mx-2"></v-icon>
              </template>

              <template v-slot:subtitle>
                <pre
                  class="text-none text-subtitle-1"><strong>Score: {{ profile.puntuacio }}       <v-btn prepend-icon="mdi-account-multiple" elevation="4" rounded="xl" class="mb-1 text-none text-subtitle-1" size="small" @click="dialogFriends = true">Friends: {{ profile.friends?.length }}</v-btn></strong></pre>
              </template>

              <template v-slot:text>
                <v-card-text class="mx-16">{{ profile.bio }}</v-card-text>
              </template>

              <template v-slot:append v-if="userId == user.user.id">
                <v-btn variant="text" icon="mdi-pencil" @click="handleIconClick('/users/' + userId + '/edit')"></v-btn>
              </template>
              <!-- ========================== TABS Y CONTENIDO =========================== -->
              <v-col>
                <v-card>
                  <v-tabs v-model="tab" bg-color="#ff6961" fixed-tabs>
                    <v-tab v-for="i in profile_favs.length" :key="i" :value="i">
                      {{ profile_favs[i - 1].title }}
                    </v-tab>
                  </v-tabs>
                  <div class="content-container">
                    <v-window v-model="tab">
                      <!-- :value sincroniza con las tabs -->
                      <v-window-item v-for="n in profile_favs.length" :key="n" :value="n">
                        <!-- :compData pasa los datos de cada slide a SlideGroup (chips deslizables) -->
                        <SlideGroup :compData="profile_favs[n - 1]" @delete-item="deleteItem" @show-trophyDialog="showTrophyDialog" />
                      </v-window-item>
                    </v-window>
                  </div>
                </v-card>
              </v-col>
              <v-row justify="center">
                <v-col cols="4" md="4" sm="8">
                  <v-btn block rounded="xl" class="my-12" color="#FF6961" size="large" elevation="4"
                    append-icon="mdi-star-circle-outline" @click="dialogRanking = true">
                    Ranking
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </template>

        </v-col>
      </v-container>
      <!-- ---------------- Dialog para confirmacion de eliminar ----------------- -->
      <confirmDelete v-if="dialogDelete" :itemToDelete="itemToDelete" :deleteLoading="deleteLoading"
        @confirmed-delete="deleteConfirmed" @cancel-delete="deleteCancel" />
      <!-- ----------------------- dialog para ver amigos ------------------------ -->
      <v-dialog v-model="dialogFriends" scrollable max-width="800px">
        <v-card>
          <v-toolbar color="#ff6961" dark>
            <v-icon size="35" class="ml-6">mdi-account-multiple</v-icon>
            <v-toolbar-title class="ml-6">Friends</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon dark variant="plain" @click="dialogFriends = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text style="height: 600px">
            <ListOfItems :type="'list_friends'" :userId="userId" />
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- ----------------------- dialog para ver ranking ----------------------- -->
      <v-dialog v-model="dialogRanking" scrollable max-width="800px">
        <v-card>
          <v-toolbar color="#ff6961" dark>
            <v-icon size="35" class="ml-6">mdi-star-circle-outline</v-icon>
            <v-toolbar-title class="ml-6">Ranking</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon dark variant="plain" @click="dialogRanking = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text style="height: 600px">
            <ListOfItems :type="'ranking'" :view="'ranking'" />
          </v-card-text>
        </v-card>
      </v-dialog>
      <!-- ----------------------------------------------------------------------- -->
      <v-dialog v-model="trophyDialog">
        <trophyInfo @quit-trophyDialog="quitTrophyDialog" :trophy="trophySelected"/>
      </v-dialog>
    </v-col>
  </template>
</template>

<!-- =============================== SCRIPTS =============================== -->
<script setup>
import confirmDelete from "@/components/confirmDelete.vue";
import SlideGroup from "@/components/slideGroup.vue";
import ListOfItems from "@/components/listOfItems.vue";
import trophyInfo from "@/components/trophyInfo.vue";
import { mapGetters } from "vuex";
import axios from "axios";
</script>

<script>
export default {
  data() {
    return {
      profile: {},
      profile_favs: [],
      tab: null,
      dialogFriends: false,
      dialogRanking: false,
      dialogDelete: false,
      itemToDelete: null,
      idxToDelete: null,
      idToDelete: null,
      deleteLoading: false,
      userId: null,
      loadingUser: false,
      trophyDialog: false,
      trophySelected: null,
    };
  },
  components: {
    SlideGroup,
    confirmDelete,
    ListOfItems,
    trophyInfo,
  },
  computed: {
    ...mapGetters(["user"]),
  },
  created() {
    // Acceder al ID del usuario desde los parámetros de la ruta
    this.loadingUser = true;
    this.userId = this.$route.params.user_id;
  },
  mounted() {
    axios
      .get("https://cultucat.hemanuelpc.es/users/" + this.userId + "/")
      .then((response) => {
        if (response.status == 200) {
          this.profile = response.data;
          // Ahora, puedes realizar las operaciones necesarias con la respuesta de manera asincrónica
          this.agregarSlideGroup(
            this.profile_favs,
            1,
            "Favourite Tags",
            this.profile.tags_preferits
          );
          this.agregarSlideGroup(
            this.profile_favs,
            2,
            "Favourite Places",
            this.profile.espais_preferits
          );
          // ============================= GET TROFEOS =============================
          const config = {
              headers: {
                'Authorization': `Token ${this.user.token}`,
                'Content-Type': 'application/json',
              }
            }
            console.log(config);
          axios
            .get("https://cultucat.hemanuelpc.es/trophies/", config)
            .then((response2) => {
              if (response2.status == 200) {
                this.agregarSlideGroup(
                  this.profile_favs,
                  3,
                  "Trophies",
                  response2.data
                );
                this.loadingUser = false;
              }
            })
            .catch((error) => {
              // Maneja errores aquí
              console.error("Error al obtener los trofeos del usuario:", error);
            });
          // =========================== COMMIT CHANGES ============================
          this.$store.commit("setProfileData", this.profile);

          this.isAdmin = this.profile.is_staff;
        }
        // Almacena la respuesta en la propiedad profile cuando la solicitud se completa

      })
      .catch((error) => {
        // Maneja errores aquí
        console.error("Error al obtener el perfil del usuario:", error);
      });
    this.isAdmin = this.user.user.is_staff;
  },
  methods: {
    handleIconClick(route) {
      this.$router.push(route);
    },
    deleteItem({ index, chipName, chipCat, id }) {
      this.itemToDelete = { chipName, chipCat };
      this.dialogDelete = true;
      this.idxToDelete = index;
      this.idToDelete = id;
    },
    deleteConfirmed(isLoading) {
      this.deleteLoading = isLoading;
      let tabTitle = "tags_preferits";
      if (this.tab - 1 === 1) tabTitle = "espais_preferits";
      axios
        .delete(
          "https://cultucat.hemanuelpc.es/users/" +
          this.userId +
          "/" +
          tabTitle +
          "/" +
          this.idToDelete +
          "/"
        )
        .then((response) => {
          if (response.status === 204) {
            this.profile_favs[this.tab - 1].arr.splice(this.idxToDelete, 1);
            this.$store.commit("setProfileData", this.profile);
          }
        })
        .catch((error) => {
          // Maneja errores aquí
          console.error("Error al obtener borrar elemento.", error);
        })
        .finally(() => {
          this.reset(); // Mueve esto aquí para que se ejecute después de la eliminación exitosa o con error
          this.deleteLoading = false; // Establecer el estado de carga a false independientemente de si la solicitud fue exitosa o no
        });
    },
    deleteCancel() {
      this.reset();
    },
    quitTrophyDialog(){
      this.trophyDialog = false;
    },
    showTrophyDialog(index){
      this.trophyDialog = true;
      this.trophySelected = this.profile_favs[2].arr[index];
    },
    getUsers() {
      axios
        .get("https://cultucat.hemanuelpc.es/users/")
        .then((response) => {
          if (response.status === 200) {
            return response.data;
          }
        })
        .catch((error) => {
          // Maneja errores aquí
          console.error("Error al obtener el perfil del usuario:", error);
        });
    },
    reset() {
      this.dialogDelete = false;
      this.idxToDelete = null;
      this.itemToDelete = null;
    },
    agregarSlideGroup(array, id, title, arr) {
      array.push({
        id: id,
        title: title,
        arr: arr || [], // Si no se proporciona un array específico, se crea un array vacío
      });
    },
  },
};
</script>

<!-- =============================== ESTILOS =============================== -->

<style scoped>
.content-container {
  margin: 30px 0;
  /* Agrega espacio superior y inferior*/
  text-align: center;
}
</style>
