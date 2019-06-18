<template>
  <nav>
    <div class="py-4 border-b border-gray-200">
      <a href="/" class="px-4"><font-awesome-icon icon="home" /> Home</a>
      <a href="http://www.arunmozhi.in/blog/" class="px-4">
        <font-awesome-icon icon="blog" /> Blog
      </a>
      <a href="https://twitter.com/tecoholic" class="px-4">
        <font-awesome-icon :icon="['fab', 'twitter']" /> Twitter
      </a>
      <div class="inline font-light tracking-wider mr-4 float-right">
        Tecoholic's Visualizations
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TopNav'
}
</script>

<style scoped></style>
