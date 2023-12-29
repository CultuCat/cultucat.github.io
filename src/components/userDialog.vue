<template>
  <v-dialog v-model="openDialog" scrollable max-width="600px">
    <v-card :loading="isLoading">
      <v-toolbar color="#ff6961">
        <template v-if="isRanking">
          <v-icon size="35" class="ml-6">mdi-star-circle-outline</v-icon>
          <v-toolbar-title class="ml-6">{{$t('USER.RANKING')}}</v-toolbar-title>
        </template>
        <template v-else-if="isFriends">
          <v-icon size="35" class="ml-6">mdi-account-multiple</v-icon>
          <v-toolbar-title class="ml-6">{{ $t('USER.AMICS') }}</v-toolbar-title>
        </template>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark variant="plain" @click="this.$emit('closeDialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text style="height: 600px">
        <v-list v-if="users.length > 0">
          <v-list-item v-for="(item, index) in users" :key="item.id">
            <userPreview :item="item" :index="index" :isRanking="isRanking" />
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

export default {
  name: "userDialog",
  data() {
    return {
      isLoading: false,
      users: [],
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
    userId: {
      type: String,
      default: null,
    }
  },
  computed: {
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
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
