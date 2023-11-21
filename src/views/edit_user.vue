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
            <v-form @submit.prevent="submit">
              <!-- ============================ EDITAR AVATAR ============================ -->
              <div>
                <profileCard :img="formData.imatge" />
              </div>
              <!-- ============================= TEXTFIELDS ============================== -->
              <v-row class="mt-16">
                <v-col cols="12" md="6" sm="12">
                  <v-text-field
                    cols="6"
                    label="Username"
                    v-model="formData.username"
                    variant="filled"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="6" md="6" sm="12">
                  <v-text-field
                    cols="6"
                    label="Name"
                    v-model="formData.first_name"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col class="ma-1">
                  <v-textarea
                    label="Biography"
                    v-model="formData.bio"
                    variant="outlined"
                  ></v-textarea>
                </v-col>
              </v-row>
              <!-- ===================== PRIVACIDAD(PUBLICO/PRIVADO) ===================== -->
              <v-row class="mt-16">
                <v-col cols="12" md="6" sm="12">
                  <v-switch
                    :label="`Profile privacy: ${
                      formData.isVisible ? 'Public' : 'Private'
                    }`"
                    v-model="formData.isVisible"
                    color="success"
                    hide-details
                    inset
                    class="my-10"
                  ></v-switch>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <v-switch
                    :label="`Wants to talk: ${
                      formData.wantsToTalk ? 'Yes' : 'No'
                    }`"
                    v-model="formData.wantsToTalk"
                    color="success"
                    hide-details
                    inset
                    class="my-10"
                  ></v-switch>
                </v-col>
              </v-row>

              <!-- ============================= SUBMITFORM ============================== -->
              <v-row justify="center">
                <v-col cols="4" sm="8">
                  <v-btn
                    :loading="loading"
                    type="submit"
                    block
                    class="mt-2"
                    :color="loading ? 'success' : '#FF6961'"
                    append-icon="mdi-check-circle-outline"
                  >
                    {{ loading ? '<v-icon>mdi-check-circle</v-icon>' : 'Confirm changes' }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-container>
    </v-col>
</template>

<!-- =============================== SCRIPTS =============================== -->

<script>
import profileCard from "@/components/profileCard.vue";
import axios from "axios";

export default {
  data() {
    return {
      formData: { ...this.$store.state.profileData },
      isEditing: false,
      loading: false,
      timeout: null,
      userId: null,
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      try {
        const ruta = "https://cultucat.hemanuelpc.es/users/" + this.userId + "/";
        await axios.put(ruta, this.formData);
        this.$store.commit('setProfileData', this.formData);
        this.$router.push("/users/" + this.userId);
      } catch (error) {
        console.error("Error al enviar datos:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {},
  components: {
    profileCard,
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
  margin: 30px 0; /* Agrega espacio superior y inferior*/
  text-align: center;
}
</style>
