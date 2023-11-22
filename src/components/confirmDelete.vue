<!-- ======================================================================= -->
<!--              VENTANA DIALOGO PARA CONFIRMAR ACCION DELETE               -->
<!-- ======================================================================= -->

<template>
  <v-row justify="center">
    <v-dialog v-model="dialogDelete" max-width="600">
      <v-card>
        <v-card-title class="headline">Delete Confirmation</v-card-title>
        <v-card-text v-if="delUser"><strong>¿ {{ itemToDelete.first_name }}, are you sure you want to delete your
            account?</strong>
          <br><br>
          <span style="color: #B00020;"><strong>*** This action is not reversible! ***</strong></span>
        </v-card-text>
        <v-card-text v-else>
          ¿Are you sure you want to delete
          <strong>'{{ itemToDelete.chipName.nom }}'</strong> from your
          <strong>{{ itemToDelete.chipCat.toLowerCase() }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteCancel">Cancelar</v-btn>
          <v-btn @click="deleteConfirmed" :loading="deleteLoading" color="error">Eliminar</v-btn>
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
    delUser: Boolean,
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
