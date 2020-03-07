<template>
  <section class="container section">
    <h1 class="title">Gross Enrollment Ratio Across States</h1>
    <p class="content">
      Gross enrolment ratio (GER): Total enrolment in a specific level of
      education, regardless of age, expressed as a percentage of the eligible
      official school-age population corresponding to the same level of
      education in a given school-year . This visualization shows the GER of all
      the states in India across different school levels. It helps in
      identifying the dropout rates when transistioning from one school level to
      another.
    </p>

    <p class="content">
      <strong>Source:</strong>
      <a
        href="https://data.gov.in/resources/gross-enrolment-ratio-2013-14-2015-16"
      >
        Gross Enrolment Ratio from 2013-14 to 2015-16
      </a>
      data released by U-DISE on Data.gov.in
    </p>

    <b-notification :closable="false">
      <font-awesome-icon icon="info-circle" />
      Hovering over the lines will highlight a particular state
    </b-notification>

    <div id="dia">
      <svg ref="viz" :width="width" :height="height"></svg>
    </div>
  </section>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'GER',
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
      ],
      states: []
    }
  },
  computed: {
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
      this.csv = await d3.csv('/data/GER_1.csv')
      this.states = this.csv.map(row => row.State_UT)
      this.renderLabels()
      this.draw()
    },
    renderLabels() {
      const labels = this.svg.append('g').attr('id', 'state_names')

      labels
        .selectAll('text')
        .data(
          this.csv.sort(
            (a, b) =>
              parseFloat(b[this.xColumns[0]]) - parseFloat(a[this.xColumns[0]])
          )
        )
        .enter()
        .append('text')
        .attr('x', 140)
        .attr('y', (d, i) => i * 25 + 34)
        .text(d => d.State_UT)
        .attr('font-size', '11px')
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'hanging')

      const colors = d3
        .scalePoint()
        .domain(this.csv.map(d => d.State_UT))
        .range([0, 1])

      this.states = this.csv.map(d => d.State_UT)

      labels
        .selectAll('rect')
        .data(this.csv)
        .enter()
        .append('rect')
        .attr('x', 150)
        .attr('y', (d, i) => i * 25 + 30)
        .attr('height', '15px')
        .attr('width', '5px')
        .attr('fill', d => d3.interpolateSpectral(colors(d.State_UT)))
    },
    draw() {
      const curvePoints = {}
      for (let i = 0; i < this.states.length; i++) {
        curvePoints[this.states[i]] = []
      }
      const xPos = d3
        .scalePoint()
        .domain(this.xColumns)
        .range([320, this.width - 50])

      const colors = d3
        .scalePoint()
        .domain(this.states)
        .range([0, 1])

      // Draw the titles

      this.svg
        .append('g')
        .attr('id', 'titles')
        .selectAll('text')
        .data(this.xColumns)
        .enter()
        .append('text')
        .attr('x', d => xPos(d))
        .attr('y', 5)
        .text(d => {
          const t = d.split('_')
          t.splice(-1, 1)
          return t.join(' ')
        })
        .attr('font-size', '11px')
        .attr('font-family', 'sans-serif')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'hanging')

      for (let i = 0; i < this.xColumns.length; i++) {
        const col = this.xColumns[i]
        this.csv.sort((a, b) => parseFloat(b[col]) - parseFloat(a[col]))
        this.csv.forEach((row, idx) => curvePoints[row.State_UT].push(idx))
      }

      // curve definition
      const connector = d3.line().curve(d3.curveCardinal.tension(0.8))

      // draw the connectors
      this.svg
        .append('g')
        .attr('id', 'connectors')
        .selectAll('path')
        .data(this.csv)
        .enter()
        .append('path')
        .attr('d', d => {
          const points = this.xColumns.map((col, i) => [
            xPos(col),
            curvePoints[d.State_UT][i] * 25 + 38
          ])
          points.splice(0, 0, [150, points[0][1]])

          return connector(points)
        })
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('opacity', 0.1)
        .attr('fill', 'none')

      // draw the connectors_overlay with a wider size for highlights
      this.svg
        .append('g')
        .attr('id', 'connectors_overlay')
        .selectAll('path')
        .data(this.csv)
        .enter()
        .append('path')
        .attr('d', d => {
          const points = this.xColumns.map((col, i) => [
            xPos(col),
            curvePoints[d.State_UT][i] * 25 + 38
          ])
          points.splice(0, 0, [150, points[0][1]])

          return connector(points)
        })
        .attr('stroke', d => d3.interpolateSpectral(colors(d.State_UT)))
        .attr('stroke-width', 10)
        .attr('opacity', 0)
        .attr('fill', 'none')

        .on('mouseover', function(d, i) {
          d3.select(this)
            .attr('stroke-width', 6)
            .attr('opacity', 1)
        })
        .on('mouseout', function(d, i) {
          d3.select(this)
            .attr('stroke-width', 10)
            .attr('opacity', 0)
        })

      // Draw the labels and blocks in the descending order
      for (let i = 0; i < this.xColumns.length; i++) {
        const col = this.xColumns[i]
        this.csv.sort((a, b) => parseFloat(b[col]) - parseFloat(a[col]))

        const g = this.svg.append('g').attr('id', col + '_labels')
        const g2 = this.svg.append('g').attr('id', col + '_boxes')

        g.selectAll('text')
          .data(this.csv)
          .enter()
          .append('text')
          .attr('x', xPos(col) + 8)
          .attr('y', (d, i) => i * 25 + 34)
          .text(d => Math.round(d[col]))
          .attr('font-size', '11px')
          .attr('font-family', 'sans-serif')
          .attr('alignment-baseline', 'hanging')
          .attr('opacity', 0.8)

        g2.selectAll('rect')
          .data(this.csv)
          .enter()
          .append('rect')
          .attr('x', xPos(col))
          .attr('y', (d, i) => i * 25 + 30)
          .attr('height', '15px')
          .attr('width', '5px')
          .attr('fill', d => d3.interpolateSpectral(colors(d.State_UT)))
      }
    }
  }
}
</script>

<style scoped></style>
