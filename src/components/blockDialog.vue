<template>
  <v-dialog v-model="openDialog" persistent max-width="500px">
    <v-card>
      <v-card-text v-if="isBlocked">Estas segur que vols desbloquejar aquest usuari?</v-card-text>
      <v-card-text v-else>Estas segur que vols bloquejar aquest usuari?</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red-darken-1" variant="text" @click="closeDialog(false)">
          Cancel
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" :loading="isLoading" @click="blockUser(id)">
          <span v-if="isBlocked">Unblock</span>
          <span v-else>Block</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

export default {
  name: "blockDialog",
  data() {
    return {
      isLoading: false,
    };
  },
  props: {
    dialog: {
      type: Boolean,
      Require: true,
    },
    id: {
      type: String,
      Require: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    token() {
      return this.$store.state.user.token;
    },
    openDialog() {
      return this.dialog;
    },
  },
  methods: {
    async blockUser(id) {
      this.isLoading = true;
      try {
        const response = await fetch(`https://cultucat.hemanuelpc.es/users/${id}/block_profile/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.token}`,
          },
          body: JSON.stringify({
            isBlocked: !this.isBlocked,
          }),
        });
        if (response.ok) {
          this.isLoading = false;
          this.closeDialog(true);
        } else {
          console.error('Error al bloquear usuario');
        }
      } catch (error) {
        console.error('Error en la solicitud POST:', error);
      }
    },
    closeDialog(value) {
      this.$emit("closeDialog", value);
    },
  },
};
</script>
