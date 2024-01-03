<template>
  <div v-if="show" class="pop-up">
    <div class="pop-up-inner">
      <v-col>
        <v-row justify="center">
          <h1>{{ title }}</h1>
        </v-row>
        <v-row class="mb-2" justify="center">
          <p>{{$t('TICKETS.ticket')}}</p>
        </v-row>
        <v-row class="mb-2" justify="center">
          <img :src="image" alt="Popup Image" />
        </v-row>
        <v-row justify="center">
          <v-btn
            block
            color="#ff6961"
            type="submit"
            variant="elevated"
            @click="closePopup"
          >
          {{$t('close')}}
          </v-btn>
        </v-row>
      </v-col>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageSrc: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png?20200615212723",
    },
    title: {
      type: String,
      default: "Event Ticket",
    },
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      show: false,
      url: "https://cultucat.hemanuelpc.es/tickets/",
      image: this.imageSrc,
    };
  },
  created() {
    this.url = "https://cultucat.hemanuelpc.es/tickets/";
  },
  methods: {
    closePopup() {
      this.show = false;
    },
    openPopup() {
      this.fetchImg();
      this.show = true;
    },

    fetchImg() {
      if (this.id != null) {
        fetch(this.url + this.id + "/")
          .then((response) => {
            if (!response.ok) {
              throw new Error("No se pudo obtener el archivo JSON");
            }
            return response.json();
          })
          .then((data) => {
            this.image = this.imageSrc;
            console.log(data.image);
          })
          .catch((error) => {
            console.error("Error:", error);
          })
          .finally(() => {
            //this.isLoading = false; // Restablecer isLoading después de la solicitud, ya sea exitosa o con error
          });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.pop-up {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  padding: 32px 16px 120px;
  width: 100%;
  height: 100vh;
  display: grid;
  place-items: center;

  &-close {
    position: absolute;
    top: 52px;
    right: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3rem;
    color: #fff;
    cursor: pointer;
  }
  &-inner {
    background-color: rgba(208, 210, 210, 0.94);
    color: #ff6961;
    position: relative;
    width: 40%;
    padding: 40px;
    border-radius: 14px;
    box-shadow: 0 10px 10px rgba($color: #000, $alpha: 0.2);
  }
}
</style>
