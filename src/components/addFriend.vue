<template>
    <v-btn 
    :icon = iconName 
    color="#ff6961"
    @click="addFriend" 
    class="add-friend-button">
    </v-btn>
  </template>
  
  <script>
  
  export default {
    props:{
        id: {
            type: String,
            default: '1'
        },
        user: {
            type: Object,
            default: null
        }
    },
    data() {
      return {
        userId:null,
        url:"",
        urlAdd: "",
        urlFriend: "",
        iconName:"mdi-heart-plus-outline",
        response: null,
        profile:{},
      }
    },
    created() {
      this.url = "https://cultucat.hemanuelpc.es";
      this.userId = this.user.id;
      this.urlAdd = `${this.url}/users/${this.userId}/send_friend_request/`;
      this.urlFriend = `${this.url}/users/${this.id}/`;
      this.checkFriend();
      
    },
    methods: {
        friendExists(id) {
            return this.user.friends.some(user => String(user.id) === String(id));
        },
        pendingFriendExists(id) {
            return this.profile.pending_friend_requests.some(request => String(request.to_user.id) === String(id));
        },
        checkFriend() {
        fetch(this.urlFriend)
            .then((response) => {
            if (response.ok) {
                return response.json(); // Asegúrate de que la respuesta es un objeto JSON
            } else {
                throw new Error('Error en la petición');
            }
            })
            .then((data) => {
            this.profile = data;
            if (this.friendExists(this.id)){
                this.iconName="mdi-heart";
            } else {
                if (this.pendingFriendExists(this.id)) {
                this.iconName="mdi-clock-plus-outline"; 
                }      
            }
            })
            .catch((error) => {
            // Maneja errores aquí
            console.error("Error al encontrar amigo", error);
            });
        },
        addFriend() {
            if (this.iconName == "mdi-heart-plus-outline") {
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