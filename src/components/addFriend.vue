<template>
    <v-btn 
    :icon = iconName 
    color="#ff6961"
    @click="addFriend" 
    class="add-friend-button">
    </v-btn>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  export default {
    props:{
        id: {
            type: String,
            default: '1'
        }
    },
    data() {
      return {
        userId:null,
        url:"",
        urlAdd: "",
        iconName:"mdi-heart-plus-outline",
        response: null,
      }
    },
    created() {
      this.url = "https://cultucat.hemanuelpc.es";
      this.userId = this.user.user.id;
      this.urlAdd = `${this.url}/users/${this.userId}/send_friend_request/`;
      this.checkFriend()
      
    },
    computed: {
        ...mapGetters(['user']),
    },
    methods: {
        friendExists(id) {
            return this.user.user.friends.some(user => user.id === id);
        },
        pendingFriendExists(id) {
            return this.user.user.pending_friend_requests.some(user => user.id === id);
        },
        checkFriend() {
            if (this.friendExists(this.id)){
                this.iconName="mdi-heart";
            }
            else{
                if (this.pendingFriendExists(this.id)) {
                   this.iconName="mdi-clock-plus-outline"; 
                }      
            }
            console.log(this.user);
        },
        addFriend() {
            fetch(this.urlAdd, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "to_user": this.id,
                }),
            })
            .then((response) => {
                if (!response.ok) {
                throw new Error("No se pudo obtener el archivo JSON");
                }
                return response.json();
            })
            .then((data) => {
                this.response= data;
                this.urlAdd = data.next;
                this.iconName="mdi-clock-plus-outline";
                console.log(this.user.user);
            })
            .catch((error) => {
                console.error("Error:", error);
            })
            .finally(() => {
                //this.isLoading = false; // Restablecer isLoading después de la solicitud, ya sea exitosa o con error
            });
        }
    }
  }
  </script>
  
  <style scoped>
  .add-friend-button {
    background: none;
    border: none;
    cursor: pointer;
    box-shadow: none;
  }
  .add-friend-button img {
    width: 20px;
    height: 20px;
  }
  .icon {
    border: 20px solid #87ceec;
    border-radius: 100px;
  }
  </style>