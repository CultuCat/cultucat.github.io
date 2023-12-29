<template>
  <v-navigation-drawer expand-on-hover rail :style="{ backgroundColor: '#ff6961', color: '#ffffff' }">
    <v-list style="padding: 3.5px !important;">
      <div style="display: flex; align-items: center;">
        <v-img src="../assets/logo.png" :min-width="48" :max-width="48" aspect-ratio="1/1" />
        <div style="margin-left: 1rem;">CultuCat</div>
      </div>
    </v-list>

    <v-divider></v-divider>

    <v-list v-if="adminView" dense nav>
      <v-list-item v-for=" item  in  adminItems" :key="item.title" :prepend-icon="item.icon" :title="item.title"
        :to="item.to" @click="handleItemClick(item.to)">
      </v-list-item>
    </v-list>

    <v-list v-else dense nav>
      <v-list-item v-for=" item  in  items" :key="item.title" :prepend-icon="item.icon" :title="item.title" :to="item.to"
        @click="handleItemClick(item.to)">
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-group :value="profile.group">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :prepend-avatar="avatar" :title="profile.username"
            :subtitle="profile.email"></v-list-item>
        </template>

        <v-list dense nav class="v-list-item-child">
          <v-list-item density="compact" v-for="item in profile.children" :key="item.title" :prepend-icon="item.icon"
            :title="item.title" :to="item.to" @click="handleItemClick(item.to)">
          </v-list-item>
        </v-list>
      </v-list-group>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-group :prepend-icon="languages.icon">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title=currentLanguageTitle()></v-list-item>
        </template> 

        <v-list-item density="compact" v-for="language in languages.values.filter(language => language.value !== this.$i18next.language)"
           :key="language.value" :title="language.text" @click="$i18next.changeLanguage(language.value)">
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
    
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "AppBar",
  data() {
    return {
      adminView: this.$route.path.includes("admin") ? true : false,
      isAdmin: null,
      items: [
        {
          title: this.$t('NAV_BAR.HOME'),
          icon: "mdi-home-outline",
          fillIcon: "mdi-home",
          to: "/home",
        },
        {
          title: this.$t('NAV_BAR.SEARCH'),
          icon: "mdi-magnify",
          fillIcon: "mdi-magnify",
          to: "/search",
        },
        {
          title: this.$t('NAV_BAR.MAPA'),
          icon: "mdi-map-outline",
          fillIcon: "mdi-map",
          to: "/map",
        },
        {
          title: this.$t('NAV_BAR.TICKETS'),
          icon: "mdi-ticket-outline",
          fillIcon: "mdi-ticket",
          to: "/tickets",
        },
        {
          title: this.$t('NAV_BAR.CHATS'),
          icon: "mdi-message-outline",
          fillIcon: "mdi-message",
          to: "/chats",
        },
      ],
      adminItems: [
        {
          title: this.$t('NAV_BAR.ADMIN_EVENTS'),
          icon: "mdi-calendar-text-outline",
          fillIcon: "mdi-calendar-text",
          to: "/admin/events",
        },
        {
          title: this.$t('NAV_BAR.ADMIN_USERS'),
          icon: "mdi-account-multiple-outline",
          fillIcon: "mdi-account-multiple",
          to: "/admin/users",
        },
      ],
      profile: {
        group: "User",
        username: null,
        email: null,
        avatar: null,
        children: [],
      },
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
  computed: {
    ...mapGetters(['user']),
    avatar() {
      return this.user.user.imatge;
    }
  },
  watch: {
    avatar(newAvatar) {
      // Puedes realizar acciones adicionales cuando la propiedad computada cambie, si es necesario
      this.profile.avatar = newAvatar;
    }
  },
  mounted() {
    this.profile.username = this.user.user.username;
    this.profile.email = this.user.user.email;
    this.profile.avatar = this.user.user.imatge;
    this.isAdmin = this.user.user.is_staff;
    this.setChildren();
    this.languages.title = "CAT";
  },
  methods: {
    ...mapActions(['logoutUser']),
    setChildren() {
      this.profile.children = [
        {
          title: this.$t('NAV_BAR.USER_PROFILE'),
          icon: "mdi-account-outline",
          fillIcon: "mdi-account",
          to: `/users/${this.user.user.id}`,
        },
      ]
      if (this.isAdmin) {
        if (this.adminView) {
          this.profile.children.push(
            {
              title: this.$t('NAV_BAR.APP'),
              icon: "mdi-arrow-left",
              to: "/home",
            }
          )
        }
        else {
          this.profile.children.push(
            {
              title: this.$t('NAV_BAR.ADMIN'),
              icon: "mdi-shield-crown-outline",
              to: "/admin/events",
            }
          )
        }
      }
      this.profile.children.push(
        {
          title: this.$t('NAV_BAR.USER_SETTINGS'),
          icon: "mdi-cog-outline",
          to: "/settings",
        },
        {
          title: this.$t('NAV_BAR.USER_LOGOUT'),
          icon: "mdi-logout",
          to: "/login",

        },
      )
    },
    handleItemClick(route) {
      if ((this.adminView && route === "/home") || (!this.adminView && route === "/admin/home")) {
        window.location.pathname = route;
      }
      else if(route === "/login") this.logoutUser();
      else window.location.pathname = route;
    },
    currentLanguageTitle() {
      const currentLanguage = this.languages.values.find(lang => lang.value === this.$i18next.language);
      return currentLanguage ? currentLanguage.text : 'CAT';
    }
  },
};
</script>

<style scoped>
.v-list-item-child {
  padding: 0 !important;
}
</style>