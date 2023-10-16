<template>
  <v-col>
    <h1 style="color: #FF6961;">Creació d'un esdeveniment</h1>

    <v-form @submit="submitForm">
      <v-text-field label="Nom" v-model="formData.nom" variant="outlined"></v-text-field>
      <v-text-field label="Descripció" v-model="formData.descripcio" variant="outlined"></v-text-field>
      <v-file-input
        label="Selecciona imatge (jpg o png)"
        :accept="'image/jpeg, image/png'"
        variant="outlined"
        v-model="formData.imatge"
      ></v-file-input>

      <v-row>
        <v-col cols="12" md="6" class="d-flex justify-center"> 
          <v-date-picker v-model="formData.dataIni"></v-date-picker>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center"> 
          <v-date-picker v-model="formData.dataFi"></v-date-picker>
        </v-col>
      </v-row>
      <br>

      <v-text-field label="Preu" v-model="formData.preu" variant="outlined"></v-text-field>
      <v-text-field label="Horaris" v-model="formData.horaris" variant="outlined"></v-text-field>
      <v-text-field label="Enllaç" v-model="formData.ellaç" variant="outlined"></v-text-field>
      <v-text-field label="Adreça" v-model="formData.adreça" variant="outlined"></v-text-field>

      <v-row>
        <v-col cols="6">
          <v-text-field label="Latitud" v-model="formData.latitud" variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field label="Longitud" v-model="formData.longitud" variant="outlined"></v-text-field>
        </v-col>
      </v-row>

      <v-text-field label="Espai" v-model="formData.espai" variant="outlined"></v-text-field>

      <v-btn type="submit" color="#FF6961">Crea</v-btn>
    </v-form>
  </v-col>
</template>

<script>
export default {
  name: "CreateEvent",
  data() {
    return {
      formData: {
        nom: '',
        descripcio: '',
        imatge: null, // You can store the selected image file here
        dataIni: null, // Use unique variable names for date pickers
        dataFi: null,
        preu: '',
        horaris: '',
        enllaç: '',
        adreça: '',
        latitud: '',
        longitud: '',
        espai: '',
      },
    };
  },
  methods: {
    submitForm() {
      // Handle form submission here
      console.log('Form data:');
      for (const key in this.formData) {
        console.log(key + ':', this.formData[key]);
      }
    },
  },
};
</script>
