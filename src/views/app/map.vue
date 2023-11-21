<template>
  <div class = 'container'>
    <div v-if="currentEvents.length" class='events'>
      <v-row align="start">
        <v-col>
          <h1 style="color: #ff6961" class="my-5 ml-5">Events</h1>
        </v-col>
        <v-col align="right" class="my-5 mr-5">
          <v-btn 
            rounded="xl"
            @click="closeClick()"
            >Close</v-btn
          >
        </v-col>
      </v-row>
      <v-row align="start">
        <ListOfItems :items="currentEvents" />
      </v-row>
        
       
      
      
      
       
    </div>
    <GMapMap
        ref="gmap"
        :center="center"
        :zoom="8"
        :style="{ width: mapWidth, height: '100vh' }"
        @dragend="updatePosition"
        @zoom_changed="updatePosition"
        class="map"
    >
        <GMapMarker
            :key="m.nom"
            v-for="m in markers"
            :position="{ lat: Number(m.latitud), lng: Number(m.longitud) }"
            :clickable="true"
            :draggable="false"
            :title="m.nom"
            @click="handleMarkerClick(m)"
        />
        <GMapMarker
          :position="ubi"
          :clickable="true"
          :draggable="false"
          :title="'Ubicación actual'"
          :icon="{
            url: 'src/assets/ubi.png',
            scaledSize: { width: 32, height: 32 },  // Cambia estos valores para ajustar el tamaño
            origin: { x: 0, y: 0 },
          }"
          :zIndex="1000"
        />
    </GMapMap>
  </div>
</template>
<script setup>
  import ListOfItems from "@/components/listOfItems.vue";
</script>
<script async>
export default {
  data() {
    return {
      mapWidth: '100vw',
      loading: false,
      currentEvents: [],
      url: "",
      fetchEventsUrl: "",
      fetchMarkersUrl: "",
      center: {lat: 41.3861689, lng: 2.0503379},
      ubi: {lat: 41.3861689, lng: 2.0503379},
      zoom: 8,
      nMarkers:105,
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
        this.markers= data;
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
        this.currentEvents= data.results;
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
  components: {
    ListOfItems,
  },

  

}
</script>

<style scoped>
.container {
  display: flex;
  overflow: hidden;
}
.events{
  width: px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100vh;
}

</style>