<template>
  <v-card class="my-2 mx-3" elevation="4" rounded="xl" :class="getCardClasses()">
    <v-card-item @click="handleClick('/users/', (item.id || item.idUser))" class="clickable">
      <template v-slot:prepend>
        <template v-if="isRanking">
          <strong>{{ index + 1 }}. </strong>
        </template>
        <v-avatar :image="item.imatge || item.avatar" size="50" class="ml-2 mr-5 my-2"></v-avatar>
        <strong>{{ item.first_name || item.name }}</strong>
      </template>
      <template v-slot:append>
        <template v-if="isRanking">
          Score: {{ item.puntuacio }}
        </template>
        <v-icon v-if="isAdmin && isBlocked">mdi-lock</v-icon>
        <v-icon v-else-if="isAdmin">mdi-lock-open-outline</v-icon>
        <v-icon v-else>mdi-chevron-right</v-icon>
      </template>
    </v-card-item>
  </v-card>
  <blockDialog :dialog="blockDialog" :id="String(item.id)" :isBlocked="item.isBlocked" @closeDialog="closeDialog" />
</template>

<script>
import blockDialog from "@/components/blockDialog.vue";

export default {
  name: "userPreview",
  components: {
    blockDialog,
  },
  data() {
    return {
      blockDialog: false,
      isBlocked: this.item.isBlocked,
    };
  },
  props: {
    item: {
      type: Object,
    },
    isRanking: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
    },
  },
  computed: {
    isFirst() {
      return this.index === 0;
    },
    isSecond() {
      return this.index === 1;
    },
    isThird() {
      return this.index === 2;
    },
  },
  methods: {
    handleClick(path, id) {
      if (this.isAdmin) {
        this.blockDialog = true;
      }
      else
        window.location.pathname = path + id;
    },
    getCardClasses() {
      if (this.isRanking) {
        return {
          'ranking-style': true,
          'first-place': this.isFirst,
          'second-place': this.isSecond,
          'third-place': this.isThird,
        };
      }
      return {}; // Sin clases adicionales si view no es 'ranking'
    },
    closeDialog(update) {
      this.blockDialog = false;
      if (update) {
        this.isBlocked = !this.isBlocked;
        this.$emit("update");
      }
    },
  },
};
</script>

<style scoped>
.clickable:hover {
  cursor: pointer;
}

.first-place {
  background-color: #ffd700;
}

.second-place {
  background-color: #bebebe;
}

.third-place {
  background-color: #cd7f32;
}
</style>
