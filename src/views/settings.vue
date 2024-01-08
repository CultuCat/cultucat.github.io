<template>
  <h1 class="mt-4 ml-5" style="color: #ff6961">{{ $t('CONFIG.Config') }}</h1>
  <v-card class="mx-5 mt-4 mb-3 card" rounded="lg" elevation="4">
    <v-row class="mx-2 mt-1">
      <v-col>
        <p class="mx-3 mt-1 language-title">{{ $t('CONFIG.Idioma') }}</p>
        <v-list dense class="language-list">
          <v-list-group :prepend-icon="languages.icon">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" :title=getcurrentLanguageTitle() />
            </template>
            <v-list-item density="compact"
              v-for="language in filteredLanguages"
              :key="language.value" :title="language.text" @click="changeLanguagePut(language.value)">
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-col>
    </v-row>
    <v-divider class="mx-5 my-1" />
    <v-row class="mx-2">
      <v-col>
        <p class="mx-3 mt-2 language-title">{{ $t('CONFIG.Permissions') }}</p>
        <v-row class="align-center mx-4 mt-1">
          <p class="mr-2">{{ $t('CONFIG.Privacy') }}</p>
          <v-switch :label="`${userPrivacy ? 'Private' : 'Public'
            }`" v-model="userPrivacy" color="#ff6961" hide-details density="compact" @click="profilePrivacy" />
        </v-row>
        <v-row class="align-center mx-4 mb-1">
          <p class="text-caption">{{ $t('CONFIG.PrivacyTxt') }}</p>
        </v-row>
        <v-row class="align-center mx-4 mt-1">
          <p class="mr-2">{{ $t('CONFIG.WantsToTalk') }}</p>
          <v-switch :label="`${userWantsToTalk ? 'Yes' : 'No'
            }`" v-model="userWantsToTalk" color="#ff6961" hide-details density="compact" @click="wantsToTalk" />
        </v-row>
        <v-row class="align-center mx-4 mb-1">
          <p class="text-caption">{{ $t('CONFIG.WantsToTalkTxt') }}</p>
        </v-row>
      </v-col>
    </v-row>
    <v-divider class="mx-5 my-3" />
    <v-row class="mx-2">
      <v-col>
        <p class="mx-3 language-title">{{ $t('CONFIG.DeleteAccount') }}</p>
        <v-btn class="ma-4" @click="deleteUser" color="error" prepend-icon="mdi-account-remove">
          {{ $t('USER.Eliminar_user') }}
        </v-btn>
        <confirmDelete v-if="dialogDelete" :deleteLoading="deleteLoading" :delUser="true"
          :itemToDelete="{ ...this.$store.state.profileData }" @confirmed-delete="deleteConfirmed"
          @cancel-delete="deleteCancel" />
        <p class="text-caption mx-4 mb-4">{{ $t('CONFIG.DeleteAccountTxt') }}</p>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { mapGetters } from "vuex";
import confirmDelete from "@/components/confirmDelete.vue";
import axios from "axios";
</script>

<script>
export default {
  name: "Settings",
  data() {
    return {
      languages: {
        title: null,
        icon: "mdi-web",
        values: [
          { text: 'ENG', value: 'en' },
          { text: 'ESP', value: 'es' },
          { text: 'CAT', value: 'cat' }
        ]
      },
      userPrivacy: null,
      userWantsToTalk: null,
      dialogDelete: false,
      deleteLoading: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    userId() {
      return this.user.user.id;
    },
    filteredLanguages() {
    return this.languages.values.filter(language => language.value !== this.$i18next.language);
    }
  },
  mounted() {
    this.userPrivacy = !this.user.user.isVisible;
    this.userWantsToTalk = this.user.user.wantsToTalk
  },
  methods: {
    getcurrentLanguageTitle() {
      const currentLanguage = this.languages.values.find(lang => lang.value === this.$i18next.language);
      return currentLanguage ? currentLanguage.text : 'CAT';
    },
    async changeLanguagePut(languageValue) {
      await this.$i18next.changeLanguage(languageValue);
      try {
        const response = await fetch("https://cultucat.hemanuelpc.es/users/" + this.userId + "/language/", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: languageValue,
          }),
        });
        if (!response.ok) {
          const errorlang = await response.json();
          throw new Error(`Error in save language request: ${JSON.stringify(errorlang)}`);
        }
        const errorlang = await response.json();
        console.log(`Language updated successfully: ${JSON.stringify(errorlang)}`);

        this.$store.dispatch("setUserLanguage", languageValue);

      } catch (error) {
        console.error('Error updating user language:', error);
      }
    },
    async profilePrivacy() {
      fetch(`https://cultucat.hemanuelpc.es/users/${this.userId}/is_visible_perfil/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVisible: this.userPrivacy,
        }),
      });
      this.$store.dispatch("setUserIsVisible", this.userPrivacy);
    },
    async wantsToTalk() {
      fetch(`https://cultucat.hemanuelpc.es/users/${this.userId}/wants_to_talk_perfil/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wantsToTalk: !this.userWantsToTalk,
        }),
      });
      this.$store.dispatch("setUserWantsToTalk", !this.userWantsToTalk);
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
      this.itemToDelete = null;
    },
  }
};
</script>

<style scoped lang="scss">
.card {
  min-height: calc(100vh - 95px);
}

.language-title {
  font-size: 25px;
  font-weight: bold;
  color: #ff6961;
}

.language-list {
  width: 180px;
}
</style>


