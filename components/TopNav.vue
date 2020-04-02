<template>
  <b-navbar type="is-light">
    <template slot="brand">
      <b-navbar-item :to="{ path: '/' }" tag="router-link">
        <img
          src="https://arunmozhiin.files.wordpress.com/2018/11/blogo_256.png"
          alt="Teco"
        />
        <span style="margin-left: 1rem;">
          Arunmozhi's Data Stories
        </span>
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-item href="/">
        Home
      </b-navbar-item>
      <b-navbar-item href="https://www.arunmozhi.in/blog/">
        Blog
      </b-navbar-item>
    </template>
    <template slot="end">
      <b-navbar-item href="https://twitter.com/tecoholic">
        <font-awesome-icon :icon="['fab', 'twitter']" />
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  name: 'TopNav'
}
</script>

<style scoped></style>
