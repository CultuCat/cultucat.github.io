<!-- ======================================================================= -->
<!--              VENTANA DIALOGO PARA CONFIRMAR ACCION DELETE               -->
<!-- ======================================================================= -->

<template>
  <v-row justify="center">
    <v-dialog v-model="dialogDelete" max-width="600">
      <v-card>
        <v-card-title class="headline">Delete Confirmation</v-card-title>
        <v-card-text>
          ¿Are you sure you want to delete <strong>{{ itemToDelete.chipName }}</strong> from your <strong>{{itemToDelete.chipCat.toLowerCase()}}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteCancel">Cancelar</v-btn>
          <v-btn @click="deleteConfirmed">Eliminar</v-btn>
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
  },
  methods: {
    deleteConfirmed() {
      // Emitir un evento para confirmar la eliminación
      this.$emit("confirmed-delete");
    },
    deleteCancel(){
        this.$emit("cancel-delete");
    }
  }
};
</script>
