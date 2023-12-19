<template>
  <template v-if="loading == true">
    <div class="text-center">
      <v-progress-circular
      :size="50"
      color= "red"
      indeterminate
    ></v-progress-circular>
    </div>
  </template>
  <template v-else>
    <v-container class="container">
      <v-row class="fill-height">
        <!-- Lista de usuarios -->
        <v-col cols="3">
          
            <v-card class="my-2 mx-3" elevation="4" rounded="xl">
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
        <v-col cols="auto" class="flex-shrink-1 ma-0">
          <div class="divider"></div>
        </v-col>
        <!-- Mensajes y campo de entrada -->
        <v-col cols="8" class="d-flex flex-column chat-col ">
          <div class="user-info my-2">
            <v-avatar :image="this.uImageR" size="40" class="ml-2 mr-5 my-2"></v-avatar>
            <strong style="color: white">{{ this.uNameR }}</strong>
          </div>
          <div class="flex-grow-1 d-flex flex-column overflow-auto" ref="messageContainer">
            <v-card class="flex-grow-1 overflow-auto">
              <v-card-text v-if="messageLoading == false">
                <div v-for="(message, index) in messages" :key="index" :class="{'message-container-left': String(message.user_from) !== String(uId), 'message-container-right': String(message.user_from) === String(uId)}">
                  <div :class="{'message-left': String(message.user_from) !== String(uId), 'message-right': String(message.user_from) === String(uId)}">
                    <strong> {{ message.text }} </strong>
                  </div>
                </div>
              </v-card-text>
              <div v-else class="text-center">
                <v-progress-circular
                :size="50"
                color= "red"
                indeterminate
              ></v-progress-circular>
              </div>
            </v-card>
          </div>
          <div >
            <v-textarea v-model="newMessage" label="Escribe un mensaje" ></v-textarea>
          </div>
          <div>
            <v-btn @click="sendMessage">Enviar</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>   
  </template>
 
</template>

<script setup>
  import { mapGetters } from "vuex";
  import itemPreview from "@/components/itemPreview.vue";
  import Pusher from 'pusher-js';
</script>

<script>
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
      uNameR:"Friend Username",
      uImageR: "",
      loading: true,
      messageLoading: false,
    };
  },
  computed: {
      ...mapGetters(["user"]),
  },

  async created(){
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
          if((data.user_from == this.uId && data.user_to == this.uIdR) || (data.user_from == this.uIdR && data.user_to == this.uId)) {
            this.messages.push(data); 
          }
        });
      },
      async fetchMessages() {
        try {
          const response = await fetch(this.url+'/messages/?user1='+this.uId+'&user2='+this.uIdR);
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
          const response = await fetch(this.url+'/messages/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
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
     console.log(user);
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
    components: {
      itemPreview,
    },
  },
};
</script>

<style scoped lang="scss">
.container{
  height: 100vh;
  overflow: hidden;
}
.user-info {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
  background-color: $primary;
}
.clickable:hover {
  cursor: pointer;
}
.divider {
  border-left: 1px solid #ccc;
  height: 100vh;
}

.chat-col {
  height: 100vh;
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
  .message-left, .message-right {
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

/* Add any view-specific styles here */
</style>