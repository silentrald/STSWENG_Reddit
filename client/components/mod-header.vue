<template>
  <div>
    <h1>
      {{ title }}
    </h1>
    <b-nav class="mod-nav mb-2">
      <b-nav-item :active="activeTab === 'main'" to="." :append="isIndex">
        MAIN
      </b-nav-item>
      <b-nav-item :active="activeTab === 'roles'" to="roles" :append="isIndex">
        ROLES
      </b-nav-item>
      <b-nav-item :active="activeTab === 'info'" to="info" :append="isIndex">
        INFO
      </b-nav-item>
      <b-nav-item :active="activeTab === 'reports'" to="reports" :append="isIndex">
        REPORTS
      </b-nav-item>
      <b-nav-item to=".." :append="isIndex">
        BACK
      </b-nav-item>
    </b-nav>
  </div>
</template>

<script>
export default {
  props: {
    activeTab: {
      type: String,
      default: 'main'
    },

    isIndex: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: 'Moderator Tools'
    }
  }
}
</script>
