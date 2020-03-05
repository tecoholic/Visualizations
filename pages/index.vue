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
import HomeTile from '~/components/HomeTile.vue'
export default {
  components: {
    HomeTile
  },
  data: function() {
    return {
      pages: [
        {
          title: 'NEET PG 2019',
          link: '/education/neet-pg-2019/',
          description:
            'The NEET PG is a qualifying exam conducted for MBBS graduates across the country in order for them to get admission in Post Graduate medical courses. The state wise results of this exam is visualized to compare the number of candidates who appeared with those qualified.',
          thumbnail: '/img/NEET_PG_Thumb.png'
        },
        {
          title: 'Wealth Inequality & Caste',
          link: '/socio-economic/wealth-index/',
          description:
            'Caste plays a major role in the lives of Indians despite years of affirmative action. This infographic visualizes the data from a study that focused on wealth distribution amongst various groups of people based on their caste groups like FC, BC, SC & ST.',
          thumbnail: '/img/Wealth_Caste_Thumb.png'
        },
        {
          title: 'AES & JE Cases and Deaths',
          link: '/health/aes-js-deaths/',
          description:
            'AES & JE are vector borne diseases that affect children across the country. While medicine being very much available and the disease completely treatable, the state of UP and Bihar were in news due to the number of deaths that happened in 2019. This visulization tries to map the number cases vs deaths of various states to see their effectiveness of health care.',
          thumbnail: '/img/AES_JE_Thumb.png'
        }
      ]
    }
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
