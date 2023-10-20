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
          <v-form @submit="submitForm">
            <!-- ============================ EDITAR AVATAR ============================ -->
            <div>
              <profileCard :img="formData.avatarImg" />
            </div>
            <!-- ============================= TEXTFIELDS ============================== -->
            <v-row class="mt-16">
              <v-col cols="6">
                <v-text-field
                  cols="6"
                  label="Nickname"
                  v-model="formData.nickname"
                  variant="filled"
                  readonly
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  cols="6"
                  label="Name"
                  v-model="formData.name"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="9">
                <v-text-field
                  label="Password"
                  v-model="formData.password"
                  :append-inner-icon="
                    showPassword && isEditing ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  :type="showPassword ? 'text' : 'password'"
                  :prepend-inner-icon="
                    !isEditing ? 'mdi-lock-outline' : 'mdi-lock-open-outline'
                  "
                  :variant="!isEditing ? 'filled' : 'outlined'"
                  :readonly="!isEditing"
                  @click:append-inner="toggleShowPassword"
                  hint="At least 8 characters"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-btn
                  block
                  rounded="xl"
                  size="large"
                  elevation="4"
                  append-icon="mdi-form-textbox-password"
                  @click="toggleEditing"
                >
                  {{ isEditing ? "Confirm Password" : "Edit Password" }}
                </v-btn>
              </v-col>
            </v-row>
            <!-- ===================== PRIVACIDAD(PUBLICO/PRIVADO) ===================== -->
            <v-switch
              :label="`Profile privacy: ${formData.isVisible}`"
              v-model="formData.isVisible"
              true-value="Public"
              false-value="Private"
              color="success"
              hide-details
              inset
              class="my-10"
            ></v-switch>
            <!-- ============================= SUBMITFORM ============================== -->
            <v-btn type="submit" color="#FF6961">Confirm changes</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-container>
  </v-col>
</template>

<!-- =============================== SCRIPTS =============================== -->

<script>
import profileCard from "@/components/profileCard.vue";

export default {
  name: "CreateEvent",
  data() {
    return {
      formData: {
        avatarImg: "https://randomuser.me/api/portraits/men/85.jpg", //avatar
        nickname: "eric123",
        email: "eric.riera@email.com",
        password: "●●●●●●●●●●",
        name: "Eric Riera",
        isVisible: "Private",
        language: "",
      },
      isEditing: false,
      showPassword: false, // Variable de estado para la edición
    };
  },
  methods: {
    submitForm() {
      // Handle form submission here
      console.log("Form data:");
      for (const key in this.formData) {
        console.log(key + ":", this.formData[key]);
      }
    },
    toggleEditing() {
      // Borrar el contenido del campo de texto
      if (this.isEditing) {
        this.formData.password = "●●●●●●●●●●"; // Borrar el contenido del campo de texto
      } else this.formData.password = "";
      this.isEditing = !this.isEditing;
    },
    toggleShowPassword() {
      if (this.isEditing) {
        this.showPassword = !this.showPassword;
      }
    },
  },
  watch: {
    isEditing(newIsEditing) {
      if (!newIsEditing) {
        this.showPassword = false;
      }
    },
  },
  components: {
    profileCard,
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
