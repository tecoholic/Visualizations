/* eslint-disable prettier/prettier */
<template>
  <section class="container">
    <div v-for="page in pages" :key="page.title" class="section">
      <home-tile
        :title="page.title"
        :content="page.description"
        :image="page.thumbnail"
        :link="page.link"
      ></home-tile>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import HomeTile from '~/components/HomeTile.vue'

export default {
  components: {
    HomeTile
  },
  computed: {
    ...mapState({
      pages: state => state.homeTiles
    })
  },

  head() {
    return {
      title: 'Data Stories from Arunmozhi',
      meta: [
        {
          hid: 'title',
          name: 'title',
          content: 'Data Stories from Arunmozhi'
        },
        {
          hid: 'description',
          name: 'description',
          content:
            'Data visualizations created by @tecoholic to try and tell stories via numbers'
        }
      ]
    }
  }
}
</script>

<style></style>
