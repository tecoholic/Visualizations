<template>
  <section class="container">
    <div class="py-4">
      <div class="px-4 inline font-light tracking-wider">VISUALIZATIONS</div>
      <a href="/" class="px-4"><font-awesome-icon icon="home" /> Home</a>
    </div>
    <div id="dia">
      <svg width="1000" height="600">
        <g
          v-for="(item, index) in states"
          :key="item"
          :transform="'translate(0,' + index * 10 + ')'"
        >
          <circle
            v-for="c in 100"
            :key="c"
            :cx="c * 6"
            :cy="20"
            :r="2"
            fill="#bbb"
          ></circle>
        </g>
      </svg>
    </div>
  </section>
</template>

<script>
// import * as d3 from 'd3'

export default {
  name: 'Dropout',
  data: function() {
    return {
      states: ['TN', 'KE'],
      circles: [{ x: 70, y: 50, r: 30 }, { x: 170, y: 100, r: 50 }]
    }
  },
  mounted() {}
}
</script>

<style scoped></style>
