<template>
  <v-dialog v-model="openDialog" scrollable max-width="600px">
    <v-card :loading="isLoading">
      <v-toolbar color="#ff6961">
        <v-icon size="35" class="ml-6">{{ icon }}</v-icon>
        <v-toolbar-title class="ml-6">{{ label }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark variant="plain" @click="this.$emit('closeDialog')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text style="height: 600px">
        <v-list v-if="events.length > 0" ref="dialogContent">
          <v-list-item v-for="item in events" :key="item.id">
            <eventPreview :item="item" :isSmall=true />
          </v-list-item>
        </v-list>
        <div v-else-if="!isLoading" style="text-align: center" class="my-10">
          <v-chip>{{ $t('USER.No_Results') }} </v-chip>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import eventPreview from './eventPreview.vue';

export default {
  name: "eventDialog",
  data() {
    return {
      isLoading: false,
      events: [],
      path: null,
    };
  },
  components: {
    eventPreview
  },
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["user"]),
    openDialog() {
      return this.dialog;
    },
  },
  created() {
    this.getPath();
    this.getEvents();
  },
  methods: {
    getEvents() {
      this.isLoading = true;
      fetch(`https://cultucat.hemanuelpc.es/events/${this.path}`, {
        method: "GET",
        headers: {
          'Authorization': `Token ${this.user.token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error en la solicitud');
          }
        })
        .then((data) => {
            this.events = data;
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getPath() {
      if (this.label === this.$t('HOME.Avui'))
        this.path = 'today';
      else if (this.label === this.$t('HOME.Setmana'))
        this.path = 'this_week';
      else if (this.label === this.$t('HOME.Gratis'))
        this.path = 'free';
      else if (this.label === this.$t('HOME.Popular'))
        this.path = 'popular';
    },
  },
};
</script>
