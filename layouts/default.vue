<template>
  <div>
    <top-nav></top-nav>

    <nuxt />
  </div>
</template>

<script>
import TopNav from '~/components/TopNav.vue'

export default {
  name: 'DefaultLayout',
  components: {
    TopNav
  }
}
</script>

<style lang="scss">
@import '~assets/styles/main.scss';
</style>
