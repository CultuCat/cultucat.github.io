<template>
  <v-col>
    <h1 style="color: #ff6961" class="my-5 ml-5">Creació d'un esdeveniment</h1>
    <v-container class="d-flex justify-center align-center">
      <v-col cols="12">
        <!-- ========================== AVATAR Y SETTINGS ========================== -->
        <v-card>

    <v-form @submit="submitForm">
      <p v-if="v$.formData.nom.$error" style="color: red;" class="mt-4 mb-4 ml-4 mr-4">Name can't be empty.</p>
      <v-text-field label="Nom" v-model="formData.nom" variant="outlined" class="mt-4 mb-4 ml-4 mr-4"></v-text-field>
      <p v-if="v$.formData.descripcio.$error" style="color: red;" class="mt-4 mb-4 ml-4 mr-4">Descripció max characters=560.</p>
      <v-textarea label="Descripció" v-model="formData.descripcio" variant="outlined" auto-grow class="mt-4 mb-4 ml-4 mr-4"></v-textarea>
      <!-- <v-file-input
        label="Selecciona imatge (jpg o png)"
        :accept="'image/jpeg, image/png'"
        variant="outlined"
        v-model="formData.imatge"
      ></v-file-input> -->

      <v-row>
        <v-col cols="12" class="text-center"> <!-- Center horizontally -->
          <p v-if="dateError" style="color: red;" class="mt-4 mb-4 ml-4 mr-4">La data de finalització no pot ser anterior a la de inici.</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10" md="6" class="d-flex justify-center"> 
          <v-locale-provider locale="es">
            <v-date-picker v-model="formData.dataIni" color="#FF6961" class="mt-4 mb-4 ml-4 mr-4" :locale="es" header="Data inicial" title="Selecciona una data"></v-date-picker>
          </v-locale-provider>
        </v-col>
        <v-col cols="10" md="6" class="d-flex justify-center"> 
          <v-locale-provider locale="es">
            <v-date-picker v-model="formData.dataFi" color="#FF6961" class="mt-4 mb-4 ml-4 mr-4" :locale="es-ES" landscape="true" header="Data final" title="Selecciona una data"></v-date-picker>
          </v-locale-provider>
        </v-col>
      </v-row>
      
      <br>

      <v-text-field label="Preu" v-model="formData.preu" variant="outlined" class="mt-4 mb-4 ml-4 mr-4"></v-text-field>
      <v-text-field label="Horaris" v-model="formData.horaris" variant="outlined" class="mt-4 mb-4 ml-4 mr-4"></v-text-field>
      <p v-if="v$.formData.enllac.$error" style="color: red;" class="mt-4 mb-4 ml-4 mr-4">Enllaç has to be a url.</p>
      <v-text-field label="Enllaç" v-model="formData.enllac" variant="outlined" class="mt-4 mb-4 ml-4 mr-4"></v-text-field>
      <v-text-field label="Adreça" v-model="formData.adreca" variant="outlined" class="mt-4 mb-4 ml-4 mr-4"></v-text-field>

      <v-row>
        <v-col cols="6">
          <p v-if="v$.formData.latitud.$error" style="color: red;" class="mt-4 mb-4 ml-4 mr-4">Latitud has to be a float.</p>
          <v-text-field label="Latitud" v-model="formData.latitud" variant="outlined" class="mt-4 mb-4 ml-4 mr-4"></v-text-field>
        </v-col>
        <v-col cols="6">
          <p v-if="v$.formData.longitud.$error" style="color: red;" class="mt-4 mb-4 ml-4 mr-4">Longitud has to be a float.</p>
          <v-text-field label="Longitud" v-model="formData.longitud" variant="outlined" class="mt-4 mb-4 ml-4 mr-4"></v-text-field>
        </v-col>
      </v-row>

      <v-text-field label="Espai" v-model="formData.espai" variant="outlined" class="mt-4 mb-4 ml-4 mr-4"></v-text-field>

      <v-btn type="submit" color="#FF6961" :disabled="v$.formData.$invalid || this.dateError" class="mt-4 mb-4 ml-4 mr-4">Crea</v-btn>
    </v-form>
    
  </v-card>
</v-col>
</v-container>
  </v-col>
</template>

<script>
  import axios from 'axios';
  import { useVuelidate } from '@vuelidate/core'
  import { required, url, decimal, minLength, maxLength } from '@vuelidate/validators'
  import es from 'vuetify/lib/locale/es';

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

    methods: { 
      checkDates() {
        if (this.formData.dataIni && this.formData.dataFi) {
          const start = new Date(this.formData.dataIni);
          const end = new Date(this.formData.dataFi);
  
          if (start > end) {
            this.dateError = true; 
          } else {
            this.dateError = false; 
          }
        } else {
          this.dateError = false; 
        }
      },

      submitForm() {//nattech.fib.upc.edu:40400
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

<style scoped>
  .content-container {
    margin: 30px 0; /* Agrega espacio superior y inferior*/
    text-align: center;
  }
  </style>
