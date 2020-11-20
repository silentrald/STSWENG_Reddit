<template>
  <div>
    <div class="container mt-3">
      <div v-if="is404">
        <h1>Station does not exist</h1>
      </div>
      <div v-else-if="hasStation">
        <div class="row">
          <div id="station-info" class="col-md-3 order-md-2">
            <div id="station-name-desc">
              <h3>Welcome to s/{{ name }}!</h3>
              {{ description }}
            </div>
            <div id="station-rules">
              <h4>Rules</h4>
              <div class="box">
                {{ rules }}
              </div>
            </div>
            <div id="station-mods">
              <h4>Moderators</h4>
              <div class="box">
                c/user
              </div>
            </div>
          </div>
          <div id="posts" class="col-md-9 order-md-1">
            <post />
            <post />
            <post />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import post from '../../../components/post.vue'
export default {
  components: { post },
  data () {
    return {
      is404: false,
      hasStation: false,
      name: '',
      description: '',
      rules: ''
    }
  },

  beforeMount () {
    this.loadStation()
  },

  methods: {
    loadStation () {
      const name = this.$route.params.name
      this.$axios.get(`/api/station/id/${name}`)
        .then((res) => {
          const { station } = res.data
          this.$set(this, 'hasStation', true)
          this.$set(this, 'name', station.name)
          this.$set(this, 'description', station.description)
          this.$set(this, 'rules', station.rules)
        })
        .catch((err) => {
          const { status } = err.response

          if (status === 404) {
            this.$set(this, 'is404', true)
            // this.errors = customErrors(data.errors, customErrorMsg)
          }
        })
    }
  }
}
</script>

<style>
.box {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}
</style>
