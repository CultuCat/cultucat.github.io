<!-- ======================================================================= -->
<!--                   COMPONENTE MUESTRA AVATAR Y EDITAR                    -->
<!-- ======================================================================= -->

<template>
    <div class="d-flex justify-center mb-10">
        <!-- ======================== AVATAR Y ICONO EDITAR ======================== -->
        <div style="position: relative; width: 150px; height: 150px;">
            <v-avatar color="grey" size="150" class="m-auto" style="position: relative; ">
        <v-img cover :src="img"></v-img>
      </v-avatar>
  
      <v-btn @click="openFileInput" icon style="position: absolute; bottom: 0; right: 0; z-index: 2;">
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
      if (file) {
        // Aquí puedes manejar la lógica para cargar la nueva imagen
        // Puedes usar FileReader para obtener la URL de la imagen y actualizar formData.imatge
        const reader = new FileReader();
        reader.onload = (e) => {
          this.formData.imatge = e.target.result;
          // También puedes enviar la imagen al servidor o realizar otras acciones necesarias
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>
