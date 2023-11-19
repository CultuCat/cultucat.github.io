<template>
    <div v-if="show" class="pop-up">
      <div class="pop-up-inner">
        <div class="pop-up-close" @click="closePopup">
            &times;
        </div>
        <div>
            <h1>{{title}}</h1>
            <p>This is your ticket for the event.</p>
        </div>
        <img :src="imageSrc" alt="Popup Image" />
        
        <v-btn block color="#ff6961" type="submit" variant="elevated" @click="closePopup">
            Close
        </v-btn>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
    imageSrc: {
      type: String,
      default: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png?20200615212723'
    },
    title: {
      type: String,
      default: 'Event Tickets'
    }
  },
    data() {
      return {
        show: false
      }
    },
    methods: {
      closePopup() {
        this.show = false;
      },
      openPopup() {
        this.show = true;
      }
    }
  }
  </script>
  
  <style scoped lang="scss">
  .pop-up {
    position:fixed;
    top: 0;
    left: 0;
    z-index: 10 ;
    padding: 32px 16px 120px;
    width: 100%;
    height: 100vh;
    display: grid;
    place-items: center;

    &-close{
        position: absolute;
        top: 52px;
        right: 52px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3rem;
        color:#fff;
        cursor: pointer;
    }
    &-inner{
        background-color: #d0d2d2;
        color:#ff6961;
        position:relative;
        width: 40%;
        padding: 40px;
        border-radius: 14px;
        box-shadow: 0 10px 10px rgba($color: #000,$alpha: 0.2);
    }
  }
  </style>