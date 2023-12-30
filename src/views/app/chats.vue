<template>
  <h1 class="mt-4 ml-5" style="color: #ff6961">Xat</h1>
  <v-card class="mx-5 mt-4 card" rounded="lg" :loading="loading" elevation="4">
    <v-row v-if="loading">
      <v-col cols="12" class="text-center mt-2">
        <p>Loading...</p>
      </v-col>
    </v-row>
    <v-row v-else-if="!haveFriends && !loading">
      <v-col cols="12" class="text-center">
        <v-icon size="100">mdi-account-multiple</v-icon>
        <h1>No tienes amigos</h1>
        <h1>Ve a hacer algunos!</h1>
      </v-col>
    </v-row>
    <v-row v-else>
      <!-- Lista de usuarios -->
      <v-col cols="3" class="pr-0" justify-center>
        <v-list-item v-for="user in friends" :key="user.id" class="px-3 py-2 clickable" @click="handleClick(user)">
          <template v-slot:prepend>
            <v-avatar :image="user.imatge || user.avatar" size="40" class="mr-5 my-2" />
            <strong>{{ user.first_name || user.name }}</strong>
          </template>
        </v-list-item>
      </v-col>
      <div class="divider"></div>
      <!-- Mensajes y campo de entrada -->
      <v-col v-if="friendClicked" cols="8.5" class="d-flex flex-column chat-col">
        <v-card class="my-3 pa-2 mr-3" color="#ff6961" rounded="lg">
          <v-avatar :image="uImageR" size="40" class="ml-2 mr-5 my-2"></v-avatar>
          <strong style="color: white">{{ uNameR }}</strong>
        </v-card>
        <div class="flex-grow-1 d-flex flex-column overflow-auto" ref="messageContainer">
          <v-card class="flex-grow-1 overflow-auto">
            <v-card-text v-if="!messageLoading">
              <div v-for="(message, index) in messages" :key="index"
                :class="{ 'message-container-left': message.user_from !== uId, 'message-container-right': message.user_from === uId }">
                <div :class="{ 'message-left': message.user_from !== uId, 'message-right': message.user_from === uId }">
                  <strong>{{ message.text }}</strong>
                </div>
              </div>
            </v-card-text>
            <div v-else class="text-center">
              <v-progress-circular :size="25" color="red" indeterminate />
            </div>
          </v-card>
        </div>
        <div>
          <v-textarea class="mr-3" auto-grow rows="1" row-height="20" v-model="newMessage" label="Escribe un mensaje"
            no-resize />
        </div>
        <div>
          <v-btn @click="sendMessage">Enviar</v-btn>
        </div>
      </v-col>
      <v-col v-else class="justify-center align-center">
        <v-responsive class="align-center text-center fill-height">
          <v-img height="150" src="@/assets/logo.png" />
          <p class="text-h4 font-weight-bold my-2">CultuCat messages</p>
          <div class="py-14" />
        </v-responsive>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import Pusher from 'pusher-js';

export default {
  data() {
    return {
      friends: [], // Lista de usuarios
      messages: [], // Lista de mensajes
      newMessage: '', // Mensaje nuevo
      url: "",
      urlUsers: "",
      uId: '', //Local user id
      uIdR: '', //Remote user id
      uNameR: "Friend Username",
      uImageR: "",
      loading: true,
      messageLoading: false,
      friendClicked: false,
      haveFriends: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  created() {
    this.uId = this.user.user.id;
    this.url = "https://cultucat.hemanuelpc.es";
    this.urlFriends = `${this.url}/users/${this.uId}/`;
    this.fetchFriends();
  },
  methods: {
    async initializePusher() {
      Pusher.logToConsole = true;
      let pusher = new Pusher('023f0639c639ffe33066', {
        cluster: 'eu'
      });
      const channel = pusher.subscribe('chat');
      channel.bind('message', data => {
        if ((data.user_from == this.uId && data.user_to == this.uIdR) || (data.user_from == this.uIdR && data.user_to == this.uId)) {
          this.messages.push(data);
        }
      });
    },
    async fetchMessages() {
      try {
        const response = await fetch(this.url + '/messages/?user1=' + this.uId + '&user2=' + this.uIdR);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        this.messages = data;
        this.loading = false;
        this.messageLoading = false;
        this.$nextTick(() => {
          const container = this.$refs.messageContainer;
          container.scrollTop = container.scrollHeight;
        });
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    },
    async sendMessage() {
      try {
        const txt = this.newMessage;
        this.newMessage = '';
        const response = await fetch(this.url + '/messages/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_from: this.uId,
            user_to: this.uIdR,
            text: txt
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Clear the message input after successful submission
      } catch (error) {
        console.error('Error submitting message:', error);
      }
    },
    handleClick(user) {
      this.messages = [];
      this.messageLoading = true;
      this.uImageR = user.imatge;
      this.uNameR = user.first_name;
      this.uIdR = user.id;
      this.fetchMessages();
      this.friendClicked = true;
      this.newMessage = '';
      // Lógica para abrir el chat con el usuario
    },
    async fetchFriends() {
      fetch(this.urlFriends)
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se pudo obtener el archivo JSON");
          }
          return response.json();
        })
        .then((data) => {
          this.friends = data.friends;
          this.uImageR = this.friends[0].imatge;
          this.uIdR = this.friends[0].id;
          this.uNameR = this.friends[0].first_name;
          this.haveFriends = true;
          this.initializePusher();
          this.fetchMessages();
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.clickable:hover {
  cursor: pointer;
}

.card {
  height: calc(100vh - 95px);
}

.divider {
  border-left: 1px solid #ccc;
  height: 100vh;
}

.chat-col {
  height: calc(100vh - 88px);
}

.message-container-left {
  width: 100%;
  display: flex;

  justify-content: flex-start;
  margin-bottom: 5px;
}

.message-container-right {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
}

.message-left,
.message-right {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
  display: inline-block;
  white-space: pre-wrap;
}

.message-left {
  background-color: $secondary;
  align-self: flex-start;
}

.message-right {
  background-color: $terciary;
  align-self: flex-end;
}
</style>