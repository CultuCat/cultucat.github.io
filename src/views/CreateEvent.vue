<template>
  <div>
  <v-col>
    <h1 style="color: #FF6961;">Creació d'un esdeveniment</h1>
    <br>
    <v-form @submit="submitForm">
      <v-text-field label="Nom" variant="outlined"></v-text-field>
      <v-text-field label="Descripció" variant="outlined"></v-text-field>
      <v-file-input
        label="Select Image (jpg or png)"
        v-model="selectedFile"
        :accept="'image/jpeg, image/png'"
        variant="outlined"
      ></v-file-input>
      <v-row>
      <v-col>
      <div class="d-flex justify-center align-center pa-4">
        <v-date-picker v-model="selectedDate" small></v-date-picker>
      </div>
    </v-col>

    <v-col>
      <div class="d-flex justify-center align-center pa-4">
        <v-date-picker v-model="selectedDate" small></v-date-picker>
      </div>
    </v-col>
      </v-row>
      <v-text-field label="Preu" variant="outlined"></v-text-field>
      <v-text-field label="Horaris" variant="outlined"></v-text-field>
      <v-text-field label="Enllaç" variant="outlined"></v-text-field>
      <v-text-field label="Adreça" variant="outlined"></v-text-field>
      <v-row class="d-flex justify-center align-center pa-4">
        <v-col>
        <div class="d-flex justify-center align-left">
        <v-text-field label="Latitud" variant="outlined"></v-text-field>
        </div>
        </v-col>
        <v-col>
        <div class="d-flex justify-center align-right">
        <v-text-field label="Longitud" variant="outlined"></v-text-field>
        </div>
        </v-col>
      </v-row>
      <v-text-field label="Espai" variant="outlined"></v-text-field>

      <v-btn type="submit">Crea</v-btn>
    </v-form>
    </v-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        name: '',
        description: '',
        image: null, // You can store the selected image file here
        date1: null, // Use unique variable names for date pickers
        date2: null,
        price: '',
        schedule: '',
        link: '',
        address: '',
        latitude: '',
        longitude: '',
        space: '',
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
