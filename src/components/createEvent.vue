<template>
  <v-dialog v-model="openDialog" persistent max-width="600px" scrollable>
    <v-card>
      <v-toolbar color="#ff6961">
        <v-toolbar-items>
          <v-btn icon variant="plain" @click="this.$emit('closeDialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
        <v-toolbar-title>{{ $t('ADMIN.Crear_event') }}</v-toolbar-title>
      </v-toolbar>
      <v-card-text class="py-0">
        <v-form @submit.prevent="submitForm" enctype="multipart/form-data">
          <v-row justify="center" class="ma-5">
            <v-img class="align-center" :src="imatge" :max-height="150" :max-width="150" aspect-ratio="1" cover style="border-radius: 10px">
              <v-row class="justify-center">
                <v-btn @click="openFileInput" icon variant="flat" style="opacity: 0.7">
                  <v-icon>mdi-image-plus-outline</v-icon>
                </v-btn>
              </v-row>
            </v-img>
          </v-row>
          <v-file-input ref="fileInput" accept="image/*" @change="handleFileChange" style="display: none" />
          <v-text-field class="mb-2" :label="$t('ADMIN.Nom')" v-model="formData.nom" :rules="[rules.nom]" variant="outlined" />
          <v-textarea class="mb-2" :label="$t('ADMIN.Descripcio')" v-model="formData.descripcio" :rules="[rules.descripcio]"
            variant="outlined" auto-grow />
          <v-text-field class="mb-2" type="date" :label="$t('ADMIN.Data_ini')" v-model="formData.dataIni" :rules="[rules.data]"
            variant="outlined" />
          <v-text-field class="mb-2" type="date" :label="$t('ADMIN.Data_fi')" v-model="formData.dataFi"
            :rules="[rules.data, rules.dataFi]" variant="outlined" />
          <v-text-field class="mb-2" :label="$t('ADMIN.Preu')" v-model="formData.preu" variant="outlined" />
          <v-text-field class="mb-2" :label="$t('ADMIN.Horari')" v-model="formData.horaris" variant="outlined" />
          <v-text-field class="mb-2" :label="$t('ADMIN.Enlace')" v-model="formData.enllac" :rules="[rules.enllac]"
            variant="outlined" />
          <v-text-field class="mb-2" :label="$t('ADMIN.Adress')" v-model="formData.adreca" variant="outlined" />
          <v-row>
            <v-col>
              <v-text-field :label="$t('ADMIN.Latitud')" v-model="formData.latitud" :rules="[rules.coordenada]" variant="outlined" />
            </v-col>
            <v-col>
              <v-text-field :label="$t('ADMIN.Longitut')" v-model="formData.longitud" :rules="[rules.coordenada]" variant="outlined" />
            </v-col>
          </v-row>
          <v-text-field :label="$t('ADMIN.Espai')" v-model="formData.espai" variant="outlined" />
          <v-btn type="submit" class="text-none" rounded variant="flat" :disabled="v$.formData.$invalid || this.dateError"
            style="position: absolute; top: 15px; right: 15px; background-color: white;">
            {{ $t('ADMIN.Crea') }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
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
      rules: {
        nom: v => !!v || this.$t('ADMIN.Nom_empty'),
        descripcio: v => v.length <= 560 || this.$t('ADMIN.Descripcio_max'),
        data: v => !!v || "Data no pot se buida",
        dataFi: v => {
          if (this.formData.dataIni) {
            return new Date(this.formData.dataIni) < new Date(v) || "La data de finalització no pot ser anterior a la de inici";
          }
          return true;
        },
        enllac: v => /^https?:\/\/\S+$/.test(v) || "Enllaç has to be a url",
        coordenada: v => /^\d+(\.\d+)?$/.test(v) || "Longitud has to be a float",
      },
      dateError: false,
      imatge: 'https://www.escolesblaves.cat/wp-content/uploads/2017/12/no-image-slide.png',
    };
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["user"]),
    openDialog() {
      return this.dialog;
    },
  },
  validations() {
    return {
      formData: {
        nom: { required, $autoDirty: true },
        descripcio: { maxLengthValue: maxLength(560), $autoDirty: true },
        dataIni: {},
        dataFi: {},
        preu: {},
        horaris: {},
        enllac: { url, $autoDirty: true },
        adreca: {},
        latitud: { decimal, $autoDirty: true },
        longitud: { decimal, $autoDirty: true },
        espai: {},
      },
    };
  },
  methods: {
    checkDates() {
      const start = this.formData.dataIni ? new Date(this.formData.dataIni) : null;
      const end = this.formData.dataFi ? new Date(this.formData.dataFi) : null;

      this.dateError = start && end ? start > end : false;
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      this.formData.image = file;
      this.imatge = URL.createObjectURL(file);
    },
    openFileInput() {
      this.$refs.fileInput.click();
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
          window.location.href = 'https://cultucat.netlify.app/events/' + responseData.id + '/';
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

<style scoped></style>
