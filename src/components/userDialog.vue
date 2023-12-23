<template>
  <v-dialog v-model="openDialog" scrollable max-width="600px">
    <v-card :loading="isLoading">
      <v-toolbar color="#ff6961">
        <template v-if="isRanking">
          <v-icon size="35" class="ml-6">mdi-star-circle-outline</v-icon>
          <v-toolbar-title class="ml-6">Ranking</v-toolbar-title>
        </template>
        <template v-else-if="isFriends">
          <v-icon size="35" class="ml-6">mdi-account-multiple</v-icon>
          <v-toolbar-title class="ml-6">Friends</v-toolbar-title>
        </template>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark variant="plain" @click="this.$emit('closeDialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text style="height: 600px">
        <v-list v-if="requests.length > 0 && isProfile && userId == this.user.user.id">
          <v-list-item v-for="(item, index) in requests" :key="item.id">
            <v-row align="center">
              <v-col cols="8">
                <userPreview :item="item.from_user" :index="index" :isRanking="isRanking" />
              </v-col>
              <v-col cols="2" class="d-flex justify-center align-center">
                <v-btn icon = "mdi-check" color="#ff6961" @click="manageRequest(item.id,true)" class="circle-icon"/> 
              </v-col>
              <v-col cols="2" class="d-flex justify-center align-center">
                <v-btn icon = "mdi-close" color="#ff6961" @click="manageRequest(item.id,false)" class="circle-icon"/> 
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
        <v-list v-if="users.length > 0">
          <v-list-item v-for="(item, index) in users" :key="item.id">
            <userPreview :item="item" :index="index" :isRanking="isRanking" />
          </v-list-item>
        </v-list>
        <div v-else-if="!isLoading" style="text-align: center" class="my-10">
          <v-chip> Sorry, no results found. </v-chip>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import userPreview from './userPreview.vue';
import { mapGetters } from "vuex";

export default {
  name: "userDialog",
  data() {
    return {
      isLoading: false,
      users: [],
      requests:[],
    };
  },
  components: {
    userPreview,
  },
  props: {
    dialog: {
      type: Boolean,
      Require: true,
    },
    isRanking: {
      type: Boolean,
      default: false,
    },
    isFriends: {
      type: Boolean,
      default: false,
    },
    isProfile: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      default: null,
    }
  },
  computed: {
    ...mapGetters(["user"]),
    openDialog() {
      return this.dialog;
    },
  },
  created() {
    if (this.isRanking)
      this.getRanking();
    else if (this.isFriends)
      this.getFriends();
  },
  methods: {
    getRanking() {
      this.isLoading = true;
      fetch(`https://cultucat.hemanuelpc.es/users/?ordering=-puntuacio`, {
        method: "GET"
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error en la solicitud');
          }
        })
        .then((data) => {
          this.isLoading = false;
          this.users = data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getFriends() {
      this.isLoading = true;
      fetch(`https://cultucat.hemanuelpc.es/users/${this.userId}/`, {
        method: "GET"
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error en la solicitud');
          }
        })
        .then((data) => {
          this.isLoading = false;
          this.users = data.friends;
          this.requests = data.pending_friend_requests;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    manageRequest(id, action) {
      fetch(`https://cultucat.hemanuelpc.es/users/${this.userId}/accept_friend_request/`, {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              "id": id,
              "is_accepted": action
          }),
      })
      .then((response) => {
          if (!response.ok) {
          throw new Error("No se pudo obtener el archivo JSON");
          }
          return response.json();
      })
      .then((data) => {
          this.getFriends();
      })
      .catch((error) => {
          console.error("Error:", error);
      })
      .finally(() => {
          //this.isLoading = false; // Restablecer isLoading después de la solicitud, ya sea exitosa o con error
      });
    },
    
  },
};
</script>

<style scoped>
.circle-icon {
  background: none;
  border: none;
  cursor: pointer;
  box-shadow: none;
}
</style>