<!-- ======================================================================= -->
<!--                   COMPONENTE MUESTRA AVATAR Y EDITAR                    -->
<!-- ======================================================================= -->

<template>
  <div class="d-flex justify-center mb-10">
    <!-- ======================== AVATAR Y ICONO EDITAR ======================== -->
    <div style="position: relative; width: 150px; height: 150px">
      <v-avatar
        color="grey"
        size="150"
        class="m-auto"
        style="position: relative"
      >
        <v-img cover :src="imageSource"></v-img>
      </v-avatar>

      <v-btn
        @click="openFileInput"
        icon
        style="position: absolute; bottom: 0; right: 0; z-index: 2"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </div>

    <!-- ========================== FORM UPLOAD FOTO =========================== -->
    <v-file-input
      ref="fileInput"
      :accept="'image/jpeg, image/png'"
      :v-model="img"
      style="display: none"
      @change="handleFileChange"
    ></v-file-input>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    img: String, //Recibe datos de la vista padre
  },
  methods: {
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      this.$emit("update-img", file); //Envia datos a la vista padre
    },
  },
  computed: {
    imageSource() {
      // Verificar si 'imatge' es una URL o un objeto File
      if (this.img instanceof File) {
        // Si es un objeto File, usar URL.createObjectURL para generar una URL temporal
        return URL.createObjectURL(this.img);
      } else {
        // Si es una URL, simplemente devolver la URL
        return this.img;
      }
    },
  }
};
</script>
