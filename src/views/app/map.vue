<template>
  <GMapMap
      :center="center"
      :zoom="8"
      style="width: 100vw; height:100vh;"
      @dragend="updateCenter"
  >

      <GMapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="false"
          :title="m.title"
          @click="center=m.position"
      />
   
  </GMapMap>
</template>

<script async>
export default {
  data() {
    return {
      center: {lat: 41.3927672, lng: 2.057617},
      markers: [
        {
          title: "test 1",
          position: {
            lat: 41.2927672, 
            lng: 2.057617
          },
        },
        {
          title: "test 2",
          position: {
            lat: 41.3927672, 
            lng: 1.957617
          },
        },
        {
          title: "test 3",
          position: {
            lat: 41.4927672, 
            lng: 2.057617
          },
        },
        {
          title: "test 4",
          position: {
            lat: 41.3927672, 
            lng: 2.157617
          },
        },
        {
          title: "casa",
          position: {
            lat: 41.3927672, 
            lng: 2.057617
          },
        }, // Along list of clusters
      ]
    }
  },
  methods: {
    updateCenter() {
      this.$refs.gmap.$mapPromise.then((map) => {
        this.center = {
          lat: map.getCenter().lat(),
          lng: map.getCenter().lng(),
        };
      });
    },
    
  },

  

}
</script>