<template>
  <h1 class="mt-4 ml-5" style="color: #ff6961">{{ $t('CONFIG.Config') }}</h1>
  <v-card class="mx-5 mt-4 card" rounded="lg" elevation="4">
    <v-col>
      <p class="mx-3 mt-1 language-title">{{ $t('CONFIG.Idioma') }}</p>
      <v-list dense class="language-list">
        <v-list-group :prepend-icon="languages.icon">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title=currentLanguageTitle() />
          </template>

          <v-list-item density="compact"
            v-for="language in languages.values.filter(language => language.value !== this.$i18next.language)"
            :key="language.value" :title="language.text" @click="$i18next.changeLanguage(language.value)">
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-col>
  </v-card>
</template>

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
          { text: 'CAT', value: 'ca' }
        ]
      },
    };
  },
  methods: {
    currentLanguageTitle() {
      const currentLanguage = this.languages.values.find(lang => lang.value === this.$i18next.language);
      return currentLanguage ? currentLanguage.text : 'CAT';
    }
  },
};
</script>

<style scoped lang="scss">
.card {
  height: calc(100vh - 95px);
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


