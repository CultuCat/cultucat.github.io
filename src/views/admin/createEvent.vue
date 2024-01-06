<template>
  <v-col>
    <h1 style="color: #ff6961" class="my-5 ml-5">{{$t('ADMIN.Crear_event')}}</h1>
    <v-container class="d-flex justify-center align-center">
      <v-col cols="12">
        <v-card>

          <v-form @submit.prevent="submitForm" enctype="multipart/form-data">
            <p v-if="v$.formData.nom.$error" style="color: red;" class="ma-4">{{$t('ADMIN.Nom_empty')}}.</p>
            <v-text-field label="Nom" v-model="formData.nom" variant="outlined" class="ma-4"></v-text-field>
            <p v-if="v$.formData.descripcio.$error" style="color: red;" class="ma-4">{{$t('ADMIN.Descripcio_max')}}</p>
            <v-textarea label="Descripció" v-model="formData.descripcio" variant="outlined" auto-grow class="ma-4"></v-textarea>

            <v-row>
              <v-col cols="12" class="text-center">
                <p v-if="dateError" style="color: red;" class="ma-4">La data de finalització no pot ser anterior a la de inici.</p>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10" md="6" class="d-flex justify-center"> 
                  <v-date-picker v-model="formData.dataIni" color="#FF6961" class="ma-4" :locale="es" header="Data inicial" title="Selecciona una data"></v-date-picker>
              </v-col>
              <v-col cols="10" md="6" class="d-flex justify-center"> 
                  <v-date-picker v-model="formData.dataFi" color="#FF6961" class="ma-4" :locale="es-ES" landscape="true" header="Data final" title="Selecciona una data"></v-date-picker>
              </v-col>
            </v-row>
            
            <br>

            <v-text-field label="Preu" v-model="formData.preu" variant="outlined" class="ma-4"></v-text-field>
            <v-text-field label="Horaris" v-model="formData.horaris" variant="outlined" class="ma-4"></v-text-field>
            <p v-if="v$.formData.enllac.$error" style="color: red;" class="ma-4">Enllaç has to be a url.</p>
            <v-text-field label="Enllaç" v-model="formData.enllac" variant="outlined" class="ma-4"></v-text-field>
            <v-text-field label="Adreça" v-model="formData.adreca" variant="outlined" class="ma-4"></v-text-field>

            <v-row>
              <v-col cols="12">
                <input type="file" ref="fileInput" @change="handleFileInputChange" accept="image/*" class="ma-4" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <p v-if="v$.formData.latitud.$error" style="color: red;" class="ma-4">Latitud has to be a float.</p>
                <v-text-field label="Latitud" v-model="formData.latitud" variant="outlined" class="ma-4"></v-text-field>
              </v-col>
              <v-col cols="6">
                <p v-if="v$.formData.longitud.$error" style="color: red;" class="ma-4">Longitud has to be a float.</p>
                <v-text-field label="Longitud" v-model="formData.longitud" variant="outlined" class="ma-4"></v-text-field>
              </v-col>
            </v-row>

            <v-text-field label="Espai" v-model="formData.espai" variant="outlined" class="ma-4"></v-text-field>

            <v-btn type="submit" color="#FF6961" :disabled="v$.formData.$invalid || this.dateError" class="ma-4">{{$t('ADMIN.Crea')}}</v-btn>
          </v-form>
          
        </v-card>
      </v-col>
    </v-container>
  </v-col>
</template>

<script>
  import { useVuelidate } from '@vuelidate/core'
  import { required, url, decimal, maxLength } from '@vuelidate/validators'
  import { mapGetters } from 'vuex';

  export default {
    name: "CreateEvent",
    setup: () => ({ v$: useVuelidate() }),
    data() {
      return {
        formData: {
          nom: '',
          descripcio: '',
          dataIni: null, 
          dataFi: null,
          preu: '',
          horaris: '',
          enllac: '',
          adreca: '',
          latitud: '',
          longitud: '',
          espai: '',
          image: '',
        },
        dateError: false,
      };
    },
    computed: {
      ...mapGetters(['user']),
    },
    validations () {
      return {
        formData: {
          nom: { required, $autoDirty: true},
          descripcio: { maxLengthValue: maxLength(560), $autoDirty: true },
          dataIni: {  }, 
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

      handleFileInputChange(event) {
        const file = event.target.files[0];
        this.formData.image = file;
      },

      async submitForm() {
        try {
          const formData = new FormData();
          
          formData.append('nom', this.formData.nom);
          formData.append('descripcio', this.formData.descripcio);
          formData.append('dataIni', new Date(this.formData.dataIni).toISOString().slice(0, 19));
          formData.append('dataFi', new Date(this.formData.dataFi).toISOString().slice(0, 19));
          formData.append('preu', this.formData.preu);
          formData.append('horaris', this.formData.horaris);
          formData.append('enllac', this.formData.enllac);
          formData.append('adreca', this.formData.adreca);
          formData.append('latitud', this.formData.latitud);
          formData.append('longitud', this.formData.longitud);
          formData.append('espai', this.formData.espai);
          formData.append('image', this.formData.image);

          const response = await fetch('https://cultucat.hemanuelpc.es/events/', {
            method: 'POST',
            headers: {
              'Authorization': `Token ${this.user.token}`,
            },
            body: formData,
          });

          if (response.status === 201) {
            const responseData = await response.json();
            window.location.href = 'https://cultucat.netlify.app/events/' + responseData.id +'/';
          } else {
            console.error('Error de solicitud:', response.status, response.statusText);
          }

        } catch (error) {
          console.error('Error de solicitud:', error);
        }
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
    margin: 30px 0; 
    text-align: center;
  }
</style>
