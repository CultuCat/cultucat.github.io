<template>
  <v-row justify="center">
    <v-col class="mb-0 pb-0">
      <h1 class="mt-5 ml-5" style="color: #ff6961">Xat</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-container>
      <v-card class="card" :loading="loading">
        <v-row>
          <!-- Lista de usuarios -->
          <v-col cols="3" justify-center>
            <v-card class="my-3 ml-3" elevation="4" rounded="lg">
              <v-list-item v-for="user in friends" :key="user.id">
                <v-card-item @click="handleClick(user)" class="clickable">
                  <template v-slot:prepend>
                    <v-avatar :image="user.imatge || user.avatar" size="40" class="ml-2 mr-5 my-2"></v-avatar>
                    <strong>{{ user.first_name || user.name }}</strong>
                  </template>
                  <template v-slot:append>
                    <v-icon>mdi-chevron-right</v-icon>
                  </template>
                </v-card-item>
              </v-list-item>
            </v-card>
          </v-col>
          <div class="divider"></div>
          <!-- Mensajes y campo de entrada -->
          <v-col cols="8.5" class="d-flex flex-column chat-col">
            <v-card class="my-3 pa-2 mr-3" color="#ff6961" rounded="lg">
              <v-avatar :image="uImageR" size="40" class="ml-2 mr-5 my-2"></v-avatar>
              <strong style="color: white">{{ uNameR }}</strong>
            </v-card>
            <div class="flex-grow-1 d-flex flex-column overflow-auto" ref="messageContainer">
              <v-card class="flex-grow-1 overflow-auto">
                <v-card-text v-if="!messageLoading">
                  <div v-for="(message, index) in messages" :key="index"
                    :class="{ 'message-container-left': message.user_from !== uId, 'message-container-right': message.user_from === uId }">
                    <div
                      :class="{ 'message-left': message.user_from !== uId, 'message-right': message.user_from === uId }">
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
              <v-textarea class="mr-3" auto-grow rows="1" row-height="20" v-model="newMessage" label="Escribe un mensaje" no-resize />
            </div>
            <div>
              <v-btn @click="sendMessage">Enviar</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-row>
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
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  async created() {
    this.uId = this.user.user.id;
    this.url = "https://cultucat.hemanuelpc.es";
    this.urlFriends = `${this.url}/users/${this.uId}/`;
    this.fetchFriends();
  },
  methods: {
    async initializePusher() {
      Pusher.logToConsole = true;
      var pusher = new Pusher('023f0639c639ffe33066', {
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
          this.initializePusher();
          this.fetchMessages();
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {

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
  height: calc(100vh - 100px);
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