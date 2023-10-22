<!-- ======================================================================= -->
<!--              COMPONENTE QUE MUESTRA UN PREVIEW DE UN ITEM               -->
<!-- ======================================================================= -->

<template>
  <v-card v-if="item.startDate" class="my-3 mx-3" elevation="6">
    <v-row>
      <v-col cols="1" xl="1" md="2" sm="1">
        <v-avatar :image="urlImg" class="my-2 mx-5" size="120"> </v-avatar>
      </v-col>
      <v-col cols="11" xl="11" md="10" sm="11">
        <v-card-title @click="method" class="clickable">
          <v-btn
            icon="mdi-chevron-right"
            variant="plain"
            :ripple="false"
            class="pb-1"
          ></v-btn>
          <strong>{{ item.name }}</strong>
          <p v-if="item.startDate" class="dates">
            <template v-if="item.startDate != item.endDate">
              {{ transformDate(item.startDate) }} -
              {{ transformDate(item.endDate) }}
            </template>
            <template v-else> {{ transformDate(item.startDate) }} </template>
          </p>

          <v-divider></v-divider>
        </v-card-title>
        <v-card-text>
          {{ item.description }}
          <br /><br /><strong>Price: {{ item.price }}.</strong>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>

  <v-card v-else class="my-2 mx-3" elevation="4" rounded="xl">
    <v-card-item
      @click="method"
      class="clickable"
      append-icon="mdi-chevron-right"
    >
      <v-avatar
        :image="item.avatar"
        size="50"
        class="ml-2 mr-5 my-2"
      ></v-avatar>
      <strong>{{ item.name }}</strong>
    </v-card-item>
  </v-card>
</template>

<!-- =============================== SCRIPTS =============================== -->

<script>
export default {
  data() {
    return {
      urlImg:
        "https://images.pexels.com/photos/2747450/pexels-photo-2747450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    };
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    method() {
      console.log("clicked");
    },
    transformDate(date) {
      const [day, month, year] = date.split("/");
      const dateObj = new Date(`${year}-${month}-${day}`);
      const formatOptions = {
        weekday: "short", // Short weekday format (e.g., Sat)
        month: "long", // Long month format (e.g., October)
        day: "numeric", // Numeric day format (e.g., 22)
      };
      const formatter = new Intl.DateTimeFormat("en-US", formatOptions);
      return formatter.format(dateObj);
    },
  },
};
</script>

<!-- =============================== ESTILOS =============================== -->

<style scoped>
.clickable:hover {
  cursor: pointer;
}

.dates {
  display: inline-block;
  font-size: 0.6em;
  margin-left: 1rem;
}
</style>
