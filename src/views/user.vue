<!-- ======================================================================= -->
<!--                        VISTA PERFIL DEL USUARIO                         -->
<!-- ======================================================================= -->

<template>
  <v-col>
    <h1 style="color: #ff6961" class="my-5 ml-5">Profile</h1>

    <v-container class="d-flex justify-center align-center">
      <v-col cols="12">
        <!-- ========================== AVATAR Y SETTINGS ========================== -->
        <v-card>
          <!-- ============================= SLOTS V-CARD ============================== -->
          <template v-slot:prepend>
            <v-avatar :image="profile.avatar" size="70"></v-avatar>
          </template>

          <template v-slot:title>
            {{ profile.name }}
            <v-icon icon="mdi-check-decagram" size="xs" class="mx-2"></v-icon>
          </template>

          <template v-slot:subtitle>
            <pre
              class="text-none text-subtitle-1"
            ><strong>Score: {{profile.score}}       <v-btn prepend-icon="mdi-account-multiple" elevation="4" rounded="xl" class="mb-1 text-none text-subtitle-1" size="small" @click="dialogFriends = true">Friends: {{profile.friends.length}}</v-btn></strong></pre>
          </template>

          <template v-slot:text>
            <v-card-text class="mx-16">{{profile.bio}}</v-card-text>
          </template>

          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-pencil"
              @click="handleIconClick('/users/' + userId + '/edit')"
            ></v-btn>
          </template>
          <!-- ========================== TABS Y CONTENIDO =========================== -->
          <v-col>
            <v-card>
              <v-tabs v-model="tab" bg-color="#ff6961" fixed-tabs>
                <v-tab v-for="i in profile.favs.length" :key="i" :value="i">
                  {{ profile.favs[i - 1].title }}
                </v-tab>
              </v-tabs>
              <div class="content-container">
                <v-window v-model="tab">
                  <!-- :value sincroniza con las tabs -->
                  <v-window-item v-for="n in profile.favs.length" :key="n" :value="n">
                    <!-- :compData pasa los datos de cada slide a SlideGroup (chips deslizables) -->
                    <SlideGroup
                      :compData="profile.favs[n - 1]"
                      @delete-item="deleteItem"
                    />
                  </v-window-item>
                </v-window>
              </div>
            </v-card>
          </v-col>
          <v-row justify="center">
            <v-col cols="4" md="4" sm="8">
              <v-btn
                block
                rounded="xl"
                class="my-12"
                color="#FF6961"
                size="large"
                elevation="4"
                append-icon="mdi-star-circle-outline"
              >
                Ranking
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-container>
    <!--  Dialog para confirmacion de eliminar -->
    <confirmDelete
      v-if="dialogDelete"
      :itemToDelete="itemToDelete"
      @confirmed-delete="deleteConfirmed"
      @cancel-delete="deleteCancel"
    />
      <v-dialog v-model="dialogFriends" scrollable max-width="800px">
        <v-card>
          <v-toolbar dark>
            <v-toolbar-title class="ml-15">Friends</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn icon dark variant="plain" @click="dialogFriends = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card-text style="height: 600px">
            <ListOfFavs :items="profile.friends" />
          </v-card-text>
        </v-card>
      </v-dialog>
  </v-col>
</template>

<!-- =============================== SCRIPTS =============================== -->
<script setup>
import confirmDelete from "@/components/confirmDelete.vue";
import SlideGroup from "@/components/slideGroup.vue";
import ListOfFavs from "@/components/listOfItems.vue";
import { mapGetters } from 'vuex';
</script>

<script>
export default {
  data() {
    return {
      editUserView: this.$route.path.includes("edit-user.vue") ? true : false,
      profile: {
        group: "User",
        username: null, //username
        name: null, //nombre
        email: null,//this.user.user.email, //email
        avatar: null,//this.user.user.imatge, //profile photo
        bio: null,
        score: null, //TODO dinamico
        isVisible: null,
        wantsToTalk: null,
        language: "",
        friends: [],
        favs: [
        {
          id: 1,
          title: "Favourite Tags",
          arr: [],
        },
        {
          id: 2,
          title: "Favourite Places",
          arr: [],
        },
        {
          id: 3,
          title: "Trophies",
          arr: [], //TODO array de trofeus
        },
      ],
      },
      tab: null,
      dialogFriends: false,
      dialogDelete: false,
      itemToDelete: null,
      idxToDelete: null,
    };
  },
  components: {
    SlideGroup,
    confirmDelete,
    ListOfFavs,
  },
  computed: {
    ...mapGetters(['user']),
  },
  created() {
    // Acceder al ID del usuario desde los parámetros de la ruta
    this.userId = this.$route.params.user_id;
  },
  mounted() {
    this.profile.username = this.user.user.username;
    this.profile.name = this.user.user.first_name;
    this.profile.email = this.user.user.email;
    this.profile.avatar = this.user.user.imatge;
    this.profile.score = this.user.user.puntuacio;
    this.profile.bio = this.user.user.bio;
    //this.profile.language = "";
    //this.profile.friends = obtenerUsuarios();
    this.profile.isVisible = this.user.user.isVisible;
    this.profile.wantsToTalk = this.user.user.wantsToTalk;
    this.profile.favs[0].arr = this.user.user.tags_preferits;
    this.profile.favs[1].arr = this.user.user.espais_preferits; 
    //this.profile.favs[2].arr = obtenerTrofeus();
    this.isAdmin = this.user.user.is_staff;
  },
  methods: {
    handleIconClick(route) {
      // Lógica a ejecutar cuando se hace clic en el icono
      this.$router.push(route);
    },
    deleteItem({ index, chipName, chipCat }) {
      this.itemToDelete = { chipName, chipCat };
      this.dialogDelete = true;
      this.idxToDelete = index;
    },
    deleteConfirmed() {
      this.profile.favs[this.tab - 1].arr.splice(this.idxToDelete, 1);
      this.reset();
    },
    deleteCancel() {
      this.reset();
    },
    reset() {
      this.dialogDelete = false;
      this.idxToDelete = null;
      this.itemToDelete = null;
    },
  },
};
</script>

<!-- =============================== ESTILOS =============================== -->

<style scoped>
.content-container {
  margin: 30px 0; /* Agrega espacio superior y inferior*/
  text-align: center;
}
</style>
