<template>
  <div>
    <div class="container mt-3">
      <div class="row">
        <div id="station-info" class="col-md-3 order-md-2">
          <div id="station-name-desc">
            <h3>Welcome to s/{{ this.$route.params.name }}!</h3>
          </div>
          <div id="station-rules">
            <h4>Rules</h4>
            <div class="box">
              No rules
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
</template>

<script>
import post from '../../../components/post.vue'
export default {
  components: { post }

}
</script>

<style>
.box {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}
</style>
