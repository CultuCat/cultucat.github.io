<template>
  <h1 class="mt-4 ml-5" style="color: #ff6961">{{ $t('CONFIG.Config') }}</h1>
  <v-card class="mx-5 mt-4 card" rounded="lg" elevation="4">
    
    <p class="language-title">{{$t('CONFIG.Idioma')}}</p>

    <v-list dense nav class="language-list">
      <v-list-group :prepend-icon="languages.icon">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title=currentLanguageTitle()></v-list-item>
        </template> 

        <v-list-item density="compact" v-for="language in languages.values.filter(language => language.value !== this.$i18next.language)"
           :key="language.value" :title="language.text" @click="changeLanguagePut(language.value)">
        </v-list-item>
      </v-list-group>
    </v-list>

    <v-divider></v-divider>

  </v-card>
</template>

<script setup>
import { mapGetters } from "vuex";
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
    };
  },
  computed: {
    ...mapGetters(["user"]),
    userId() {
      return this.user.user.id;
    }
    
  },
  methods: {
    currentLanguageTitle() {
      const currentLanguage = this.languages.values.find(lang => lang.value === this.$i18next.language);
      return currentLanguage ? currentLanguage.text : 'CAT';
    },
    async changeLanguagePut(languageValue) {
      await this.$i18next.changeLanguage(languageValue);
      try {
        const response = await fetch("https://cultucat.hemanuelpc.es/users/"+ this.userId +"/language/", {
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

        console.log('Language updated successfully');

      } catch (error) {
        console.error('Error updating user language:', error);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.card {
  height: calc(100vh - 95px);
}
.language-title {
  margin-top: 20px;
  margin-left: 20px;
  font-weight: bold;
  color: #ff6961;
}

.language-list {
  width: 10%; /* Adjust the width as needed */
  margin-left: 20px;
}
</style>


