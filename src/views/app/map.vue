<template>
  <div class='container'>
    <v-col v-if="currentEvents.length">
      <v-row>
        <v-col>
          <h1 style="color: #ff6961" class="my-5 ml-5">{{$t('EVENT.Events')}}</h1>
        </v-col>
        <v-col align="right" class="my-5 mr-5">
          <v-btn rounded="xl" @click="closeClick()">{{$t('close')}}</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-scroll-y style="max-height: calc(100vh - 112px); overflow-y: auto; width: 100%;">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <eventPreview class="mx-2" v-for="event in currentEvents" :key="event.id" :item="event" isSmall="true"
              style="width: 90%" />
          </div>
        </v-scroll-y>
      </v-row>
    </v-col>
    <GMapMap ref="gmap" :center="center" :zoom="8" :style="{ width: mapWidth, height: '100vh' }" @dragend="updatePosition"
      @zoom_changed="updatePosition" class="map">
      <GMapMarker :key="m.nom" v-for="m in markers" :position="{ lat: Number(m.latitud), lng: Number(m.longitud) }"
        :clickable="true" :draggable="false" :title="m.nom" @click="handleMarkerClick(m)" />
      <GMapMarker :position="ubi" :clickable="true" :draggable="false" :title="'Ubicación actual'" :icon="{
        url: 'src/assets/ubi.png',
        scaledSize: { width: 32, height: 32 },  // Cambia estos valores para ajustar el tamaño
        origin: { x: 0, y: 0 },
      }" :zIndex="1000" />
    </GMapMap>
  </div>
</template>

<script>
import eventPreview from "@/components/eventPreview.vue";

export default {
  components: {
    eventPreview,
  },
  data() {
    return {
      view: 'map',
      mapWidth: '100vw',
      loading: false,
      currentEvents: [],
      url: "",
      fetchEventsUrl: "",
      fetchMarkersUrl: "",
      center: { lat: 41.3861689, lng: 2.0503379 },
      ubi: { lat: 41.3861689, lng: 2.0503379 },
      zoom: 8,
      nMarkers: 105,
      markers: []
    }
  },
  created() {
    this.url = "https://cultucat.hemanuelpc.es";
    this.fetchEventsUrl = `${this.url}/events/?ordering=-dataIni`;
    this.fetchMarkersUrl = `${this.url}/spaces/?latitud=41.3861689&longitud=2.0503379&num_objs=1000`;
    this.getCurrentLocation();
    this.fetchMarkers();
    window.addEventListener('scroll', this.handleScroll);
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    closeClick() {
      this.currentEvents = [];
      this.mapWidth = '100vw';
    },
    getCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.ubi = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.center = this.ubi;
        });
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    },
    fetchMarkers() {
      fetch(this.fetchMarkersUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se pudo obtener el archivo JSON");
          }
          return response.json();
        })
        .then((data) => {
          this.markers = data;
          this.fetchMarkersUrl = data.next;
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          //this.isLoading = false; // Restablecer isLoading después de la solicitud, ya sea exitosa o con error
        });
    },
    fetchEvents() {
      this.isLoading = true;
      fetch(this.fetchEventsUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se pudo obtener el archivo JSON");
          }
          return response.json();
        })
        .then((data) => {
          this.currentEvents = data.results;
          this.fetchEventsUrl = data.next;
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          if (this.currentEvents.length > 0) {
            this.mapWidth = '50vw';
          }
          else {
            this.mapWidth = '100vw';
          }
        });
    },
    updatePosition() {
      this.$refs.gmap.$mapPromise.then((map) => {
        this.zoom = map.getZoom();
      });
      this.nMarkers = Math.max(1000 - (this.zoom * 60), 20);
      this.$refs.gmap.$mapPromise.then((map) => {
        this.center = {
          lat: map.getCenter().lat(),
          lng: map.getCenter().lng(),
        };
      });
      this.fetchMarkersUrl = `${this.url}/spaces/?latitud=${this.center.lat}&longitud=${this.center.lng}&num_objs=${this.nMarkers}`;
      this.fetchMarkers();

    },
    handleMarkerClick(marker) {
      this.fetchEventsUrl = `${this.url}/events/?espai=${marker.id}`;
      this.fetchEvents();
    },
    handleScroll() {
      if (!this.isLoading) {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollY + windowHeight >= documentHeight - 100) {
          //this.fetchEvents();
        }
      }
    },

  },
}
</script>

<style scoped>
.container {
  display: flex;
  overflow: hidden;
}
</style>