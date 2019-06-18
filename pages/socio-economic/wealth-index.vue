<template>
  <section class="container">
    <top-nav></top-nav>
    <div class="py-3">
      <h2 class="text-lg my-2 font-bold">
        Wealth Inequality Across Castes In India
      </h2>
      <p>
        This Visualization shows the distribution of communities across the
        wealth spectrum.
      </p>
      <p>
        <strong>Data Source: </strong>
        <a
          href="https://wid.world/document/n-k-bharti-wealth-inequality-class-and-caste-in-india-1961-2012/"
        >
          World Inequality Database - Wealth Inequality, Class and Caste in
          India, 1961-201 by <em>Nitin Kumar Bharti</em>
        </a>
      </p>
    </div>
    <div id="dia" class="mt-8">
      <svg ref="viz" :width="width" :height="height"></svg>
    </div>
  </section>
</template>

<script>
import * as d3 from 'd3'
import TopNav from '../../components/TopNav'

export default {
  name: 'WealthIndex',
  components: {
    TopNav
  },
  data: function() {
    return {
      csv: [],
      svg: null,
      width: 840,
      height: 500
    }
  },
  mounted() {
    this.svg = d3.select(this.$refs.viz)
    this.renderViz()
  },
  methods: {
    async renderViz() {
      const data = await this.$axios.$get('/data/wealthindex-NFHS-2005.csv')
      this.csv = d3.csvParse(data)
      this.drawCircles()
    },
    unwrapColumns: function(d) {
      return this.csv.columns
        .slice(1)
        .map(col => ({ value: d[col], community: d.Category, wealth: col }))
    },
    drawCircles() {
      const xScale = d3
        .scalePoint()
        .domain(this.csv.map(row => row.Category))
        .range([50, this.width])
        .padding(0.5)

      const yScale = d3
        .scalePoint()
        .domain(this.csv.columns.slice(1))
        .range([this.height - 50, 0])
        .padding(0.5)

      const colorScale = d3
        .scalePoint()
        .domain(this.csv.columns.slice(1))
        .range([0, 1])

      const g = this.svg
        .selectAll('g')
        .data(this.csv)
        .enter()
        .append('g')
        .attr('class', 'category')

      g.selectAll('circle')
        .data(this.unwrapColumns)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.community))
        .attr('cy', d => yScale(d.wealth))
        .attr('r', d => Math.sqrt(d.value) * 5)
        .attr('fill', d => d3.interpolateRdYlGn(colorScale(d.wealth)))
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1)

      const yAxis = d3
        .axisLeft(yScale)
        .tickSize(0)
        .tickPadding(5)

      this.svg
        .append('g')
        .attr('transform', 'translate(50, 0)')
        .call(yAxis)
        .attr('font-size', 12)
        .attr('font-weight', 'bold')

      const xAxis = d3
        .axisBottom(xScale)
        .ticks(d => d.Category)
        .tickSize(1)
        .tickPadding(10)

      this.svg
        .append('g')
        .attr('transform', `translate(0, ${this.height - 50})`)
        .call(xAxis)
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
    }
  }
}
</script>

<style scoped></style>
