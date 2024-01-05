<template>
  <v-dialog v-model="openDialog" scrollable max-width="600px">
    <v-card :loading="isLoading">
      <v-toolbar color="#ff6961">
        <v-icon size="35" class="ml-6">{{ icon }}</v-icon>
        <v-toolbar-title class="ml-6">{{ title }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark variant="plain" @click="this.$emit('closeDialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text style="height: 600px">
        <v-list v-if="requests.length > 0 && isFriends && userId == this.user.user.id">
          <v-list-item v-for="(item, index) in requests" :key="item.id">
            <v-row align="center">
              <v-col cols="8">
                <userPreview :item="item.from_user" :index="index" :isRanking="isRanking" />
              </v-col>
              <v-col cols="2" class="d-flex justify-center align-center">
                <v-btn icon="mdi-check" color="#ff6961" @click="manageRequest(item.id, true)" class="circle-icon" />
              </v-col>
              <v-col cols="2" class="d-flex justify-center align-center">
                <v-btn icon="mdi-close" color="#ff6961" @click="manageRequest(item.id, false)" class="circle-icon" />
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
        <v-list v-if="filteredUsers.length > 0">
          <v-list-item v-for="(item, index) in filteredUsers" :key="item.id">
            <v-row>
              <v-col class="">
                <userPreview :item="item" :index="index" :isRanking="isRanking" />
              </v-col>
              <v-col cols="auto" class="d-flex align-center"
                v-if="myUser && String(item.id) !== String(this.user.user.id)">
                <addFriend :user="myUser" :id="String(item.id)" />
              </v-col>
            </v-row>
          </v-list-item>
        </v-list>
        <div v-else-if="!isLoading" style="text-align: center" class="my-10">
          <v-chip>{{ $t('USER.No_Results') }}.</v-chip>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import userPreview from './userPreview.vue';
import addFriend from './addFriend.vue';
import { mapGetters } from "vuex";

export default {
  name: "userDialog",
  data() {
    return {
      isLoading: false,
      users: [],
      myUser: null,
      requests: [],
    };
  },
  components: {
    userPreview,
    addFriend,
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    usersArray: {
      type: Array,
      default: () => [],
      required: true
    },
    title: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    isRanking: {
      type: Boolean,
      default: false,
    },
    isFriends: {
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
    filteredUsers() {
      return this.users.filter((item) => item.isVisible && !item.isBlocked);
    }
  },
  created() {
    if (this.isRanking)
      this.getRanking();
    else if (this.isFriends) {
      this.getFriends();
      this.getUser();
    }
    else {
      this.users = this.usersArray;
      this.getUser();
    }
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
          this.users = data;
        })
        .catch((error) => {
          console.error(error);
        }).finally(() => {
          this.isLoading = false;
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
          this.users = data.friends;
          this.requests = data.pending_friend_requests;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getUser() {
      this.isLoading = true;
      fetch(`https://cultucat.hemanuelpc.es/users/${this.user.user.id}/`, {
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
          this.myUser = data;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    manageRequest(id, action) {
      this.isLoading = true;
      fetch(`https://cultucat.hemanuelpc.es/users/${this.user.user.id}/accept_friend_request/`, {
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
        .then(() => {
          this.getFriends();
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          this.isLoading = false;
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