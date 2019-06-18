<template>
  <section class="container">
    <div class="py-4">
      <div class="px-4 inline font-light tracking-wider">VISUALIZATIONS</div>
      <a href="/" class="px-4"><font-awesome-icon icon="home" /> Home</a>
    </div>
    <div id="dia">
      <svg ref="viz" :width="width" :height="height"></svg>
    </div>
  </section>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Dropout',
  data: function() {
    return {
      circles: [{ x: 70, y: 50, r: 30 }, { x: 170, y: 100, r: 50 }],
      csv: [],
      svg: null,
      width: 900
    }
  },
  computed: {
    states: function() {
      return this.csv.map(row => row.State_UT)
    },
    height: function() {
      return this.csv.length * 25
    }
  },
  mounted() {
    this.svg = d3.select(this.$refs.viz)
    this.fetchGerData()
  },
  methods: {
    async fetchGerData() {
      const data = await this.$axios.$get('/data/GER_1.csv')
      this.csv = d3.csvParse(data)
      this.renderNames()
      this.drawStateSeparators()
    },
    renderNames() {
      this.svg
        .selectAll('text')
        .data(this.states)
        .enter()
        .append('text')
        .attr('x', 0)
        .attr('y', (d, i) => (i + 1) * 25)
        .text(d => d)
        .attr('font-size', '10px')
        .attr('font-family', 'sans-serif')
        .attr('fill', 'purple')
    },
    drawStateSeparators() {
      // const seps = this.svg.select('g').append('g#seperators')
      for (let i = 0; i < this.states.length; i++) {
        this.svg
          .append('line')
          .attr('x1', 150)
          .attr('x2', this.width)
          .attr('y1', (i + 1) * 25 + 8)
          .attr('y2', (i + 1) * 25 + 8)
          .attr('stroke', 'red')
          .attr('stroke-width', 0.3)
          .attr('opacity', 0.3)
      }
      this.svg
        .append('line')
        .attr('x1', 150)
        .attr('x2', 150)
        .attr('y1', 0)
        .attr('y2', this.height)
        .attr('stroke', 'red')
        .attr('stroke-width', 0.3)
        .attr('opacity', 0.3)
    }
  }
}
</script>

<style scoped></style>
