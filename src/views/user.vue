<!-- ======================================================================= -->
<!--                        VISTA PERFIL DEL USUARIO                         -->
<!-- ======================================================================= -->

<template>
  <template v-if="profile.username != undefined">
    <h1 style="color: #ff6961" class="mt-4 ml-5">Profile</h1>
    <template v-if="loadingUser == true">
      <v-card class="mx-5 mt-4 card" rounded="lg" :loading="loadingUser" elevation="4">
        <v-card-text>Loading...</v-card-text>
      </v-card>
    </template>
    <template v-else>
      <!-- ========================== AVATAR Y SETTINGS ========================== -->
      <v-card class="mx-5 mt-4 card" rounded="lg" elevation="4">
        <!-- ============================= V-CARD ============================== -->
        <v-row class="ma-2 mb-0">
          <v-col cols="auto" class="d-flex align-center">
            <v-avatar :image="profile.imatge" size="135" />
          </v-col>
          <v-col>
            <v-row>
              <v-col cols="auto">
                <p class="text-h5 font-weight-bold">{{ profile.first_name }}</p>
                <p class="text-h6 font-weight-regular">{{ profile.username }}</p>
              </v-col>
            </v-row>
            <v-row class="d-flex align-center" style="color: #797979;">
              <div class="d-flex align-center mx-2">
                <v-icon class="mdi mdi-star-circle" />
                <strong class="mx-1">Score: {{ profile.puntuacio }}</strong>
              </div>
              <div class="d-flex align-center mx-2" @click="dialogFriends = true">
                <v-icon class="mdi mdi-account-multiple" />
                <strong class="underline-on-hover mx-1">Friends: {{ friends_nb }}</strong>
              </div>
            </v-row>
            <v-row>
              <p class="text-body-2 mx-3 mt-3">{{ profile.bio }}</p>
            </v-row>
          </v-col>
          <v-col cols="auto">
            <template v-if="canIEdit">
              <v-btn variant="text" icon="mdi-pencil" @click="editDialog = true" />
              <editUser :dialog="editDialog" @closeDialog="editDialog = false" />
            </template>
            <template v-else>
              <div v-if="profile.id !== user.user.id && myUser" style="float: right;">
                <addFriend :user="myUser" :id="String(profile.id)" />
              </div>
            </template>
          </v-col>
        </v-row>
        <!-- ========================== TABS Y CONTENIDO =========================== -->
        <v-row>
          <v-col>
            <v-card class="mx-5">
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
                    <SlideGroup :compData="profile_favs[n - 1]" @delete-item="deleteItem"
                      @show-trophyDialog="showTrophyDialog" :permissions="canIEdit" />
                  </v-window-item>
                </v-window>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="4" md="4" sm="8">
            <v-btn block rounded="xl" class="my-8" color="#FF6961" size="large" elevation="4"
              append-icon="mdi-star-circle-outline" @click="dialogRanking = true">
              Ranking
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </template>
    <!-- ---------------- Dialog para confirmacion de eliminar ----------------- -->
    <confirmDelete v-if="dialogDelete" :itemToDelete="itemToDelete" :deleteLoading="deleteLoading"
      @confirmed-delete="deleteConfirmed" @cancel-delete="deleteCancel" />
    <!-- ----------------------- dialog para ver amigos ------------------------ -->
    <userDialog :dialog="dialogFriends" :title="$t('USER.AMICS')" icon="mdi-account-multiple" :isFriends="true"
      :userId="userId" @closeDialog="dialogFriends = false" />
    <!-- ----------------------- dialog para ver ranking ----------------------- -->
    <userDialog :dialog="dialogRanking" :title="$t('USER.RANKING')" icon="mdi-star-circle-outline" :isRanking="true"
      @closeDialog="dialogRanking = false" />
    <!-- ----------------------------------------------------------------------- -->
    <v-dialog v-model="trophyDialog">
      <trophyInfo @quit-trophyDialog="quitTrophyDialog" :trophy="trophySelected" />
    </v-dialog>
  </template>
</template>

<!-- =============================== SCRIPTS =============================== -->
<script setup>
import confirmDelete from "@/components/confirmDelete.vue";
import SlideGroup from "@/components/slideGroup.vue";
import trophyInfo from "@/components/trophyInfo.vue";
import userDialog from "@/components/userDialog.vue";
import addFriend from "@/components/addFriend.vue";
import editUser from "@/components/editUser.vue";
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
      friendRequests: null,
      myUser: null,
      loadingUser: false,
      trophyDialog: false,
      trophySelected: null,
      editDialog: false,
    };
  },
  components: {
    SlideGroup,
    confirmDelete,
    trophyInfo,
    userDialog,
    addFriend,
    editUser,
  },
  computed: {
    ...mapGetters(["user"]),
    canIEdit() {
      return this.userId == this.user.user.id;
    },
    friends_nb(){
      return this.profile.friends.filter(friend => friend.isVisible).length;
    }
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
          this.getUser();
          // Ahora, puedes realizar las operaciones necesarias con la respuesta de manera asincrónica
          this.agregarSlideGroup(
            this.profile_favs,
            1,
            this.$t('USER.TAGS'),
            this.profile.tags_preferits
          );
          this.agregarSlideGroup(
            this.profile_favs,
            2,
            this.$t('USER.PLACES'),
            this.profile.espais_preferits
          );
          if (this.canIEdit) {
            const config = {
              headers: {
                'Authorization': `Token ${this.user.token}`,
                'Content-Type': 'application/json',
              }
            }
            axios
              .get("https://cultucat.hemanuelpc.es/trophies/", config)
              .then((response2) => {
                if (response2.status == 200) {
                  this.agregarSlideGroup(
                    this.profile_favs,
                    3,
                    this.$t('USER.TROFEUS'),
                    response2.data
                  );
                }
              })
              .catch((error) => {
                // Maneja errores aquí
                console.error("Error al obtener los trofeos del usuario:", error);
              });

          }
          // ============================= GET TROFEOS =============================

          // =========================== COMMIT CHANGES ============================
          this.$store.commit("setProfileData", this.profile);

          this.isAdmin = this.profile.is_staff;
          this.loadingUser = false;
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

    quitTrophyDialog() {
      this.trophyDialog = false;
    },
    showTrophyDialog(index) {
      this.trophyDialog = true;
      this.trophySelected = this.profile_favs[2].arr[index];
    },
    getUser() {
      axios
        .get("https://cultucat.hemanuelpc.es/users/" + this.user.user.id + "/")
        .then((response) => {
          if (response.status === 200) {
            this.myUser = response.data;
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
.card {
  min-height: calc(100vh - 95px);
}

.content-container {
  margin: 30px 0;
  /* Agrega espacio superior y inferior*/
  text-align: center;
}

.underline-on-hover:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>