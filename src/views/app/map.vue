<template>
  <GMapMap
      :center="center"
      :zoom="8"
      style="width: 100vw; height:100vh;"
  >
    <GMapMarker
      :key="index"
      v-for="(m, index) in markers"
    />
  </GMapMap>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      center: {lat: 41.3927672, lng: 2.057617},
      markers: [
        {
          position: {
            lat: 41.3927672, lng: 2.057617
          },
        }, // Along list of clusters
      ]
    }
  }
}
</script>