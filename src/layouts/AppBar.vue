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
      <v-list-item v-for=" item  in  adminItems" :key="item.title" :prepend-icon="item.icon" :title="item.title" :to="item.to"
        @click="handleItemClick(item.to)">
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
          <v-list-item v-bind="props" :prepend-avatar="profile.avatar" :title="profile.name"
            :subtitle="profile.email"></v-list-item>
        </template>

        <v-list dense nav class="v-list-item-child">
          <v-list-item density="compact" v-for="item in profile.children" :key="item.title" :prepend-icon="item.icon"
            :title="item.title" :to="item.to" @click="handleItemClick(item.to)">
          </v-list-item>
        </v-list>

      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
    
<script>
export default {
  name: "AppBar",
  data() {
    return {
      adminView: this.$route.path.includes("admin") ? true : false,
      isAdmin: true,
      items: [
        {
          title: "Home",
          icon: "mdi-home-outline",
          fillIcon: "mdi-home",
          to: "/home",
        },
        {
          title: "Search",
          icon: "mdi-magnify",
          fillIcon: "mdi-magnify",
          to: "/search",
        },
        {
          title: "Map",
          icon: "mdi-map-outline",
          fillIcon: "mdi-map",
          to: "/map",
        },
        {
          title: "Tickets",
          icon: "mdi-ticket-outline",
          fillIcon: "mdi-ticket",
          to: "/tickets",
        },
        {
          title: "Chats",
          icon: "mdi-message-outline",
          fillIcon: "mdi-message",
          to: "/chats",
        },
      ],
      adminItems: [
        {
          title: "Home",
          icon: "mdi-home-outline",
          fillIcon: "mdi-home",
          to: "/admin/home",
        },
        {
          title: "Events",
          icon: "mdi-calendar-text-outline",
          fillIcon: "mdi-calendar-text",
          to: "/admin/events",
        },
        {
          title: "Users",
          icon: "mdi-account-multiple-outline",
          fillIcon: "mdi-account-multiple",
          to: "/admin/users",
        },
      ],
      profile: {
        group: "User",
        name: "Eric Riera", //username
        email: "eric.riera@email.com", //email
        avatar: "https://randomuser.me/api/portraits/men/85.jpg", //profile photo
        children: [],
      },
    };
  },
  mounted() {
    this.setChildren();
  },
  methods: {
    setChildren() {
      this.profile.children = [
        {
          title: "Profile",
          icon: "mdi-account-outline",
          fillIcon: "mdi-account",
          to: "/users/1",
        },
      ]
      if (this.isAdmin) {
        if (this.adminView) {
          this.profile.children.push(
            {
              title: "Back to app",
              icon: "mdi-arrow-left",
              to: "/home",
            }
          )
        }
        else {
          this.profile.children.push(
            {
              title: "Go to admin",
              icon: "mdi-shield-crown-outline",
              to: "/admin/home",
            }
          )
        }
      }
      this.profile.children.push(
        {
          title: "Settings",
          icon: "mdi-cog-outline",
          to: "/settings",
        },
        {
          title: "Logout",
          icon: "mdi-logout",
          to: "/login",

        },
      )
    },
    handleItemClick(route) {
      if ((this.adminView && route === "/home") || (!this.adminView && route === "/admin/home")){
        window.location.pathname = route;
      }
      else this.$router.push(route);
    }
  },
};
</script>

<style scoped>
.v-list-item-child {
  padding: 0 !important;
}
</style>
