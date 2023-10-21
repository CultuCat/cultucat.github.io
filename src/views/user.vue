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
              class="mt-2"
            ><strong>Score: {{profile.score}}         Friends: {{profile.friends}}</strong></pre>
          </template>

          <template v-slot:append>
            <v-btn
              variant="text"
              icon="mdi-cog-outline"
              @click="handleIconClick('/users/' + userId + '/edit')"
            ></v-btn>
          </template>
          <!-- ========================== TABS Y CONTENIDO =========================== -->
          <v-col>
            <v-card>
              <v-tabs v-model="tab" bg-color="#ff6961" fixed-tabs>
                <v-tab v-for="i in items.length" :key="i" :value="i">
                  {{ items[i - 1].title }}
                </v-tab>
              </v-tabs>
              <div class="content-container">
                <v-window v-model="tab">
                  <!-- :value sincroniza con las tabs -->
                  <v-window-item v-for="n in items.length" :key="n" :value="n">
                    <!-- :compData pasa los datos de cada slide a SlideGroup (chips deslizables) -->
                    <SlideGroup
                      :compData="items[n - 1]"
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
  </v-col>
</template>

<!-- =============================== SCRIPTS =============================== -->
<script setup>
import confirmDelete from "@/components/confirmDelete.vue";
import SlideGroup from "@/components/slideGroup.vue";
</script>

<script>
export default {
  data() {
    return {
      editUserView: this.$route.path.includes("edit-user.vue") ? true : false,
      profile: {
        group: "User",
        nickname: "",
        name: "Eric Riera", //username
        email: "eric.riera@email.com", //email
        password: "●●●●●●●●●●",
        avatar: "https://randomuser.me/api/portraits/men/85.jpg", //profile photo
        score: 700, //TODO dinamico
        isVisible: "Private",
        language: "",
        friends: 28,
      },
      items: [
        {
          id: 1,
          title: "Favourite Tags",
          arr: [], //TODO array de tags favorits
        },
        {
          id: 2,
          title: "Favourite Places",
          arr: [
            "Barcelona",
            "Costa Brava",
            "Costa Dorada",
            "Tarragona",
            "Girona",
            "Sitges",
            "Montserrat",
          ], //TODO array de llocs favorits
        },
        {
          id: 3,
          title: "Trophies",
          arr: ["Joan Miró Admirer", "Opera Enthusiast", "Museum Maestro"], //TODO array de trofeus
        },
      ],
      tab: null,
      dialogDelete: false,
      itemToDelete: null,
      idxToDelete: null,
    };
  },
  components: {
    SlideGroup,
    confirmDelete,
  },
  created() {
    // Acceder al ID del usuario desde los parámetros de la ruta
    this.userId = this.$route.params.user_id;
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
      this.items[this.tab - 1].arr.splice(this.idxToDelete, 1);
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
