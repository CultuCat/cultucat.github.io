<template>
  <v-col>
    <h1 style="color: #FF6961;">Creació d'un esdeveniment</h1>
    <br>
    <v-form @submit="submitForm">
      <p v-if="v$.formData.nom.$error" style="color: red;">Name can't be empty.</p>
      <v-text-field label="Nom" v-model="formData.nom" variant="outlined"></v-text-field>
      <p v-if="v$.formData.descripcio.$error" style="color: red;">Descripció max characters=560.</p>
      <v-text-field label="Descripció" v-model="formData.descripcio" variant="outlined"></v-text-field>
      <!-- <v-file-input
        label="Selecciona imatge (jpg o png)"
        :accept="'image/jpeg, image/png'"
        variant="outlined"
        v-model="formData.imatge"
      ></v-file-input> -->

      <v-row>
        <v-col cols="12" class="text-center"> <!-- Center horizontally -->
          <p v-if="dateError" style="color: red;">La data de finalització no pot ser anterior a la de inici.</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10" md="6" class="d-flex justify-center"> 
          <h2 style="color: rgb(121, 121, 121)">Data inici</h2>
        </v-col>
        <v-col cols="10" md="6" class="d-flex justify-center"> 
          <h2 style="color: rgb(121, 121, 121)">Data fi</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10" md="6" class="d-flex justify-center"> 
          <v-date-picker v-model="formData.dataIni" color="#FF6961"></v-date-picker>
        </v-col>
        <v-col cols="10" md="6" class="d-flex justify-center"> 
          <v-date-picker v-model="formData.dataFi" color="#FF6961"></v-date-picker>
        </v-col>
      </v-row>
      
      <br>

      <v-text-field label="Preu" v-model="formData.preu" variant="outlined"></v-text-field>
      <v-text-field label="Horaris" v-model="formData.horaris" variant="outlined"></v-text-field>
      <p v-if="v$.formData.enllac.$error" style="color: red;">Enllaç has to be a url.</p>
      <v-text-field label="Enllaç" v-model="formData.enllac" variant="outlined"></v-text-field>
      <v-text-field label="Adreça" v-model="formData.adreca" variant="outlined"></v-text-field>

      <v-row>
        <v-col cols="6">
          <p v-if="v$.formData.latitud.$error" style="color: red;">Latitud has to be a float.</p>
          <v-text-field label="Latitud" v-model="formData.latitud" variant="outlined"></v-text-field>
        </v-col>
        <v-col cols="6">
          <p v-if="v$.formData.longitud.$error" style="color: red;">Longitud has to be a float.</p>
          <v-text-field label="Longitud" v-model="formData.longitud" variant="outlined"></v-text-field>
        </v-col>
      </v-row>

      <v-text-field label="Espai" v-model="formData.espai" variant="outlined"></v-text-field>

      <v-btn type="submit" color="#FF6961" :disabled="v$.formData.$invalid && this.dateError">Crea</v-btn>
    </v-form>
  </v-col>
</template>

<script>
  import axios from 'axios';
  import { useVuelidate } from '@vuelidate/core'
  import { required, url, decimal, minLength, maxLength } from '@vuelidate/validators'

  export default {
    name: "CreateEvent",
    setup: () => ({ v$: useVuelidate() }),
    data() {
      return {
        formData: {
          nom: '',
          descripcio: '',
          //imatge: null, // You can store the selected image file here
          dataIni: null, // Use unique variable names for date pickers
          dataFi: null,
          preu: '',
          horaris: '',
          enllac: '',
          adreca: '',
          latitud: '',
          longitud: '',
          espai: '',
        },
        dateError: false,
      };
    },
    validations () {
      return {
        formData: {
          nom: { required, $autoDirty: true},
          descripcio: { maxLengthValue: maxLength(560), $autoDirty: true },
          //imatge: {  }, // You can store the selected image file here
          dataIni: {  }, // Use unique variable names for date pickers
          dataFi: {  },
          preu: {  },
          horaris: {  },
          enllac: { url, $autoDirty: true },
          adreca: {  },
          latitud: { decimal, $autoDirty: true },
          longitud: { decimal, $autoDirty: true },
          espai: {  },
        },
      };
    },

    methods: { //nattech.fib.upc.edu:40400
      checkDates() {
        // Comprueba si ambas fechas están seleccionadas
        if (this.formData.dataIni && this.formData.dataFi) {
          // Convierte las fechas a objetos Date
          const start = new Date(this.formData.dataIni);
          const end = new Date(this.formData.dataFi);
          console.log('ENTRA');
  
          // Compara las fechas
          if (start > end) {
            this.dateError = true; // Si la fecha de fin es anterior, muestra el mensaje de error
            console.log('1');
          } else {
            this.dateError = false; // Si las fechas son válidas, oculta el mensaje de error
            console.log('2');
          }
        } else {
          this.dateError = false; // Si falta alguna fecha, oculta el mensaje de error
          console.log('3');
        }
      },

      submitForm() {
        axios.post('http://127.0.0.1:8000/events/', this.formData)
          .then(response => {
            // Procesa la respuesta del servidor, si es necesario
            console.log('Respuesta del servidor:', response.data);
          })
          .catch(error => {
            // Maneja errores, por ejemplo, si la solicitud falla
            console.error('Error de solicitud:', error);
          });
      },
    },
    watch: {
      'formData.dataIni': 'checkDates',
      'formData.dataFi': 'checkDates',
    },
  };
</script>
