<template>
  <div id="top-stations">
    <h3>Top Stations</h3>
    <div id="stations-container">
      <div
        v-for="station in stations"
        :key="station.name"
        class="station-container"
      >
        <nuxt-link :to="`/s/${station.name}`">
          <div class="station">
            <div class="image-container">
              <img class="station-image" src="https://picsum.photos/48/48">
            </div>
            <div class="text-container">
              <u>s/{{ station.name }}</u>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      stations: []
    }
  },

  beforeMount () {
    this.loadStations()
  },

  methods: {
    async loadStations () {
      try {
        const res = await this.$axios.get('/api/station/top')
        this.$set(this, 'stations', res.data.stations)
      } catch (_err) {}
    }
  }
}
</script>

<style scoped>
#stations-container {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 1px 15px;
  height: max-content;
}

.stations-container {
  padding: 0 0.75rem;
}

.station {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  margin: 15px 0;
}

.image-container {
  margin-right: 8px;
  width: 48px;
}

.station-image {
  border-radius: 50%;
  width: 48px;
  height: 48px;
}

.text-container {
  color: white;
  font-size: 20px;
}
</style>
