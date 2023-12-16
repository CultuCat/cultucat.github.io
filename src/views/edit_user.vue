<!-- ======================================================================= -->
<!--                           VISTA EDITAR PERFIL                           -->
<!-- ======================================================================= -->

<template>
  <v-col>
    <!-- =============================== TITULO ================================ -->
    <h1 style="color: #ff6961" class="my-5 ml-5">Edit Profile</h1>
    <!-- ============================== CONTENIDO ============================== -->
    <v-container class="d-flex justify-center align-center">
      <v-col cols="12" md="10" sm="8">
        <v-card class="pa-12" variant="elevated">
          <v-btn @click="deleteUser" color="error" dark prepend-icon="mdi-account-remove"
            style="position:absolute; top:30px; right:30px;">
            Eliminar Usuario
          </v-btn>
          <v-form @submit.prevent="submit" enctype="multipart/form-data">
            <!-- ============================ EDITAR AVATAR ============================ -->
            <div>
              <profileCard :img="formData.imatge" @update-img="updateImg"/>
            </div>
            <!-- ============================= TEXTFIELDS ============================== -->
            <v-row class="mt-16">
              <v-col cols="12" md="6" sm="12">
                <v-text-field cols="6" label="Username" v-model="formData.username" variant="filled"
                  readonly></v-text-field>
              </v-col>
              <v-col cols="6" md="6" sm="12">
                <v-text-field cols="6" label="Name" v-model="formData.first_name" variant="outlined"></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col class="ma-1">
                <v-textarea label="Biography" v-model="formData.bio" variant="outlined"></v-textarea>
              </v-col>
            </v-row>
            <!-- ===================== PRIVACIDAD(PUBLICO/PRIVADO) ===================== -->
            <v-row class="mt-16">
              <v-col cols="12" md="6" sm="12">
                <v-switch :label="`Profile privacy: ${formData.isVisible ? 'Public' : 'Private'
                  }`" v-model="formData.isVisible" color="success" hide-details inset class="my-10"></v-switch>
              </v-col>
              <v-col cols="12" md="6" sm="12">
                <v-switch :label="`Wants to talk: ${formData.wantsToTalk ? 'Yes' : 'No'
                  }`" v-model="formData.wantsToTalk" color="success" hide-details inset class="my-10"></v-switch>
              </v-col>
            </v-row>

            <!-- ============================= SUBMITFORM ============================== -->
            <v-row justify="center">
              <v-col cols="4" sm="8">
                <v-btn :loading="loading" type="submit" block class="mt-2" :color="loading ? 'success' : '#FF6961'"
                  append-icon="mdi-check-circle-outline">
                  {{ loading ? '<v-icon>mdi-check-circle</v-icon>' : 'Confirm changes' }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-container>
  </v-col>

  <confirmDelete v-if="dialogDelete" :deleteLoading="deleteLoading" :delUser="true" :itemToDelete="formData" @confirmed-delete="deleteConfirmed"
    @cancel-delete="deleteCancel" />
</template>

<!-- =============================== SCRIPTS =============================== -->

<script>
import profileCard from "@/components/profileCard.vue";
import confirmDelete from "@/components/confirmDelete.vue";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      formData: { ...this.$store.state.profileData },
      imatge: this.$store.state.profileData.imatge,
      isEditing: false,
      loading: false,
      timeout: null,
      userId: null,
      dialogDelete: false,
      deleteLoading: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    async submit() {
      this.loading = true;
      try {
        const ruta = "https://cultucat.hemanuelpc.es/users/" + this.userId + "/";
        const formData = new FormData();
        formData.append('imatge', this.imatge);
        formData.append('first_name', this.formData.first_name);
        formData.append('bio', this.formData.bio);
        formData.append('wantsToTalk', this.formData.wantsToTalk);
        formData.append('isVisible', this.formData.isVisible);
        formData.append('username', this.formData.username)
        await axios.put(ruta, formData, {
          headers: {
            'Authorization': `Token ${this.user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        } );
        this.$store.commit('setProfileData', this.formData);
        this.$store.commit('setUserImg', this.formData.imatge);
        this.$router.push("/users/" + this.userId);
      } catch (error) {
        console.error("Error al enviar datos:", error);
      } finally {
        this.loading = false;
      }
    },
    deleteUser() {
      this.dialogDelete = true;
    },
    deleteConfirmed(isLoading) {
      this.deleteLoading = isLoading;
      axios
        .delete(
          "https://cultucat.hemanuelpc.es/users/" +
          this.userId +
          "/"
        )
        .then((response) => {
          if (response.status === 204) {
            this.$store.commit("setUser", null);
            this.$store.commit("setProfileData", null);
          }
        })
        .catch((error) => {
          console.error("Error al obtener borrar elemento.", error);
        })
        .finally(() => {
          this.reset();
          this.deleteLoading = false;
          this.$router.push('/login')
        });
    },
    deleteCancel() {
      this.reset();
    },
    reset() {
      this.dialogDelete = false;
      this.idxToDelete = null;
      this.itemToDelete = null;
    },
    updateImg(file) {
        this.formData.imatge = URL.createObjectURL(file);
        this.imatge = file;
    },
  },
  components: {
    profileCard,
    confirmDelete,
  },
  created() {
    // Acceder al ID del usuario desde los parámetros de la ruta
    this.userId = this.$route.params.user_id;
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
