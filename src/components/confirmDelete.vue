<!-- ======================================================================= -->
<!--              VENTANA DIALOGO PARA CONFIRMAR ACCION DELETE               -->
<!-- ======================================================================= -->

<template>
  <v-row justify="center">
    <v-dialog v-model="dialogDelete" max-width="600">
      <v-card>
        <v-card-title class="headline">{{ $t('USER.Delete') }}</v-card-title>
        <v-card-text v-if="delUser"><strong>¿ {{ itemToDelete.first_name }}, {{ $t('USER.Delete_conf') }}</strong>
          <br><br>
          <span style="color: #B00020;"><strong>*** {{ $t('USER.No_reversible') }} ***</strong></span>
        </v-card-text>
        <v-card-text v-else>
          {{ $t('USER.Estas_segur') }}
          <strong>'{{ itemToDelete.chipName.nom }}'</strong> {{ $t('USER.De') }}
          <strong>{{ itemToDelete.chipCat.toLowerCase() }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteCancel">{{ $t('cancel') }}</v-btn>
          <v-btn @click="deleteConfirmed" :loading="deleteLoading" color="error">{{ $t('USER.Eliminar') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<!-- =============================== SCRIPTS =============================== -->
<script>
export default {
  data() {
    return {
      dialogDelete: true,
    };
  },
  props: {
    itemToDelete: Object, //Recibe datos de la vista padre
    deleteLoading: Boolean,
  },
  methods: {
    deleteConfirmed() {
      // Emitir un evento para confirmar la eliminación
      this.$emit("confirmed-delete", true);
    },
    deleteCancel() {
      this.$emit("cancel-delete");
    },
  },
};
</script>
