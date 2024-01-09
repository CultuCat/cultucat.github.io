<template>
  <v-dialog v-model="openDialog" persistent max-width="600px" scrollable>
    <v-card class="mx-5 my-4" rounded="lg" elevation="4">
      <v-toolbar color="#ff6961">
        <v-toolbar-items>
          <v-btn icon variant="plain" @click="this.$emit('closeDialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-title>{{ $t('USER.Editar') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="py-0">
        <v-form @submit.prevent="submit" enctype="multipart/form-data">
          <!-- ============================ EDITAR AVATAR ============================ -->
          <profileCard :img="formData.imatge" @update-img="updateImg" />
          <!-- ============================= TEXTFIELDS ============================== -->
          <v-text-field class="mb-2" :label="$t('USER.Username')" v-model="formData.username" :rules="userRules" variant="outlined" />
          <v-text-field class="mb-2" :label="$t('USER.Name')" v-model="formData.first_name" :rules="nameRules" variant="outlined" />
          <v-textarea :label="$t('USER.Bio')" v-model="formData.bio" variant="outlined" no-resize rows="4" />
          <!-- ============================= SUBMITFORM ============================== -->
          <v-btn :loading="loading" type="submit" class="text-none" rounded variant="flat"
            style="position: absolute; top: 15px; right: 15px; background-color: white;">
            {{ $t('save') }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import profileCard from "@/components/profileCard.vue";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      formData: { ...this.$store.state.profileData },
      imatge: this.$store.state.profileData.imatge,
      loading: false,
      userId: null,
      userRules: [v => !!v || this.$t('LOGIN.username_obligatori')],
      nameRules: [v => !!v || this.$t('LOGIN.nom_obligatori')],
    };
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["user"]),
    openDialog() {
      return this.dialog;
    },

  },
  methods: {
    async submit() {
      this.loading = true;
      try {
        const ruta = "https://cultucat.hemanuelpc.es/users/" + this.userId + "/";
        const formData = new FormData();
        if (this.imatge instanceof File) {
          formData.append('imatge', this.imatge);
        }
        formData.append('first_name', this.formData.first_name);
        formData.append('bio', this.formData.bio);
        formData.append('username', this.formData.username)
        await axios.put(ruta, formData, {
          headers: {
            'Authorization': `Token ${this.user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        this.$store.commit('setProfileData', this.formData);
        this.$store.commit('setUserImg', this.formData.imatge);
        window.location.reload();
      } catch (error) {
        console.error("Error al enviar datos:", error);
      } finally {
        this.loading = false;
      }
    },
    updateImg(file) {
      this.formData.imatge = URL.createObjectURL(file);
      this.imatge = file;
    },
  },
  components: {
    profileCard,
  },
  created() {
    this.userId = this.$route.params.user_id;
  },
};
</script>

<style scoped>
</style>
