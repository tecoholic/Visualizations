<template>
  <section class="container section">
    <h1 class="title">Gross Enrollment Ratio Across States</h1>
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
      width: 900,
      xColumns: [
        'Primary_Total',
        'Upper_Primary_Total',
        'Secondary_Total',
        'Higher_Secondary_Total'
      ]
    }
  },
  computed: {
    states: function() {
      return this.csv.map(row => row.State_UT)
    },
    height: function() {
      return this.states.length * 25 + 50
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
      this.renderLabels()
      this.draw()
    },
    renderLabels() {
      this.svg
        .selectAll('text')
        .data(this.states)
        .enter()
        .append('text')
        .attr('x', 140)
        .attr('y', (d, i) => (i + 2) * 25 - 5)
        .text(d => d)
        .attr('font-size', '11px')
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', 'end')
    },
    draw() {
      // const seps = this.svg.select('g').append('g#seperators')
      const x = d3
        .scaleBand()
        .domain(this.xColumns)
        .range([150, this.width])

      const y = d3
        .scaleLinear()
        .domain([0, 100])
        .range([0, 24])

      for (let i = 0; i < this.states.length; i++) {
        const row = this.csv[i]
        const data = this.xColumns.map(k => ({
          key: k,
          value: row[k]
        }))

        /*
        const colorSclae = d3
          .scaleLinear()
          .domain([50, 100])
          .range([0, 1])
        */

        this.svg
          .append('g')
          .attr('id', this.states[i])
          .selectAll('rect')
          .data(data)
          .join('rect')
          .attr('x', d => x(d.key))
          .attr('y', d => (i + 2) * 25 - (y(d.value) < 24 ? y(d.value) : 24))
          .attr('height', d => (y(d.value) < 24 ? y(d.value) : 24))
          .attr('width', x.bandwidth())
          //  .attr('fill', d => d3.interpolateRdYlGn(colorSclae(d.value)))
          .attr('fill', 'steelblue')
      }
      this.svg
        .append('g')
        .selectAll('text')
        .data(this.xColumns)
        .enter()
        .append('text')
        .attr('x', d => x(d) + x.bandwidth() / 2)
        .attr('y', 15)
        .text(d => {
          const t = d.split('_')
          t.pop()
          return t.join(' ')
        })
        .attr('font-size', '11px')
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', 'middle')
    }
  }
}
</script>

<style scoped></style>
