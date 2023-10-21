<!-- ======================================================================= -->
<!--                COMPONENTE QUE LISTA EVENTOS DE UN ARRAY                 -->
<!-- ======================================================================= -->

<template>
  <v-col>
    <v-container class="d-flex justify-center align-center">
      <v-col cols="10" md="10" sm="12">
        <v-card>
          <v-list>
            <v-list-item v-for="tag in tagCategories" :key="tag">
              <v-card variant="flat" class="my-2">
                <v-card-item>
                  <div class="text-h6">
                    <strong>{{
                      tag.charAt(0).toUpperCase() + tag.slice(1)
                    }}</strong>
                  </div>
                  <template v-slot:append>
                    <v-btn
                      append-icon="mdi-chevron-right"
                      variant="plain"
                      rounded="xl"
                      >View all</v-btn
                    >
                  </template>
                </v-card-item>
                <v-divider class="mb-8"></v-divider>
                <v-list>
                  <v-list-item
                    v-for="item in filtereditems(tag)"
                    :key="item.id"
                  >
                    <itemPreview :item="item" />
                  </v-list-item>
                </v-list>
              </v-card>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-container>
  </v-col>
</template>

<!-- =============================== SCRIPTS =============================== -->

<script setup>
import itemPreview from "@/components/itemPreview.vue";
</script>

<script>
export default {
  data() {
    return {
      tagCategories: ["music", "art", "films", "theatre"],
    };
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  methods: {
    method() {
      console.log("clicked");
    },
    filtereditems(tag) {
      const matchingitems = this.items.filter((item) =>
        item.tags.includes(tag)
      );
      // Limita la cantidad de elementos a un máximo de 3
      return matchingitems.slice(0, 3);
    },
  },
  components: {
    itemPreview,
  },
};
</script>

<!-- =============================== ESTILOS =============================== -->

<style scoped>
.clickable:hover {
  cursor: pointer;
}
</style>
