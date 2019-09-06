<template>
  <section class="container">
    <top-nav></top-nav>
    <div v-for="page in pages" :key="page.title">
      <div class="md:flex my-4 border border-gray-200">
        <div v-if="page.thumbnail" class="flex-shrink-0 flex justify-center">
          <img :src="page.thumbnail" alt="" />
        </div>
        <div class="p-4">
          <h3 class="text-2xl font-bold">
            <a :href="page.link" class="hover:underline">
              <span class="text-gray-700">
                {{ page.title }}
              </span>
            </a>
          </h3>
          <p class="py-3 text-gray-700">{{ page.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import TopNav from '~/components/TopNav.vue'
export default {
  components: {
    TopNav
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
          thumbnail: ''
        },
        {
          title: 'AES & JS Cases and Deaths',
          link: '/health/aes-js-deaths/',
          description:
            'AES & JS are vector borne diseases that affect children across the country. While medicine being very much available and the disease completely treatable, the state of UP and Bihar were in news due to the number of deaths that happened in 2019. This visulization tries to map the number cases vs deaths of various states to see their effectiveness of health care.',
          thumbnail: ''
        }
      ]
    }
  },
  head() {
    return {
      title: "Tecoholic's Visualizations",
      meta: [
        {
          hid: 'title',
          name: 'title',
          content: "Tecoholic's Visualizations"
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
