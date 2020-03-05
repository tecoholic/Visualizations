<template>
  <b-navbar type="is-light">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
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
      <b-navbar-item href="https://www.arunmozhi.in/blog/">
        Blog
      </b-navbar-item>
      <b-navbar-item href="https://twitter.com/tecoholic">
        Twitter
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
