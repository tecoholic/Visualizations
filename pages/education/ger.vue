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
      Hovering over the lines will highlight a particular state. Clicking on the
      lines will keep them highlighted - useful for comparing states.
    </b-notification>

    <div id="dia">
      <svg id="viz" ref="viz" :width="width" :height="height"></svg>
      <download-as-image
        class="is-pulled-right"
        selector="#viz"
        title="Gross Enrollment Ratio Across States of India"
        source="U-DISE Data from data.gov.in - 2015-16"
      >
      </download-as-image>
    </div>
  </section>
</template>

<script>
import * as d3 from 'd3'
import DownloadAsImage from '~/components/DownloadAsImage'

export default {
  name: 'GER',
  components: {
    DownloadAsImage
  },
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
      states: [],
      clicked: []
    }
  },
  head() {
    return {
      title: 'Gross Enrollement Ratio (GER) across states',
      meta: [
        {
          hid: 'og_title',
          name: 'og:title',
          content: 'Gross Enrollement Ratio (GER) across states'
        },
        {
          hid: 'description',
          name: 'description',
          content:
            'Gross enrolment ratio (GER): Total enrolment in a specific level of education, regardless of age, expressed as a percentage of the eligible official school-age population corresponding to the same level of education in a given school-year . This visualization shows the GER of all the states in India across different school levels. It helps in identifying the dropout rates when transistioning from one school level to another.'
        },
        {
          hid: 'twitter_card',
          name: 'twitter:card',
          content: 'summary'
        }
      ]
    }
  },
  computed: {
    height: function() {
      return this.states.length * 25 + 40
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
        .attr('fill', 'darkgrey')
    },
    drawTitle(xPosFn, yPos, id) {
      // Draw the titles
      this.svg
        .append('g')
        .attr('id', id)
        .selectAll('text')
        .data(this.xColumns)
        .enter()
        .append('text')
        .attr('x', d => xPosFn(d))
        .attr('y', yPos)
        .text(d => {
          const t = d.split('_')
          t.splice(-1, 1)
          return t.join(' ')
        })
        .attr('font-size', '11px')
        .attr('font-family', 'sans-serif')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'hanging')
    },
    draw() {
      const curvePoints = {}
      const vm = this
      for (let i = 0; i < this.states.length; i++) {
        curvePoints[this.states[i]] = []
      }
      const xPos = d3
        .scalePoint()
        .domain(this.xColumns)
        .range([320, this.width - 50])

      const yPos = d3
        .scaleLinear()
        .domain([20, 160])
        .range([this.height - 30, 25])

      const colors = d3.scaleOrdinal(d3.schemeCategory10)

      // draw the titles
      this.drawTitle(xPos, 5, 'top_labels')
      this.drawTitle(xPos, this.height - 15, 'bottom_labels')

      for (let i = 0; i < this.xColumns.length; i++) {
        const col = this.xColumns[i]
        this.csv.sort((a, b) => parseFloat(b[col]) - parseFloat(a[col]))
        this.csv.forEach((row, idx) => curvePoints[row.State_UT].push(idx))
      }

      // curve definition
      const connector = d3.line().curve(d3.curveCardinal.tension(1))

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
            yPos(d[col])
          ])
          points.splice(0, 0, [155, this.states.indexOf(d.State_UT) * 25 + 38])

          return connector(points)
        })
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
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
            yPos(d[col])
          ])
          points.splice(0, 0, [153, this.states.indexOf(d.State_UT) * 25 + 38])

          return connector(points)
        })
        .attr('stroke', 'darkgrey')
        .attr('stroke-width', 10)
        .attr('stroke-linecap', 'round')
        .attr('opacity', 0)
        .attr('fill', 'none')
        .on('mouseover', function(d, i) {
          d3.select(this)
            .attr('stroke-width', 5)
            .attr('opacity', 1)
        })
        .on('mouseout', function(d, i) {
          if (vm.clicked.indexOf(d.State_UT) === -1) {
            d3.select(this)
              .attr('stroke-width', 10)
              .attr('opacity', 0)
          }
        })
        .on('click', function(d, i) {
          // already clicked
          if (vm.clicked.indexOf(d.State_UT) !== -1) {
            d3.select(this)
              .attr('stroke', 'darkgrey')
              .attr('stroke-width', 10)
              .attr('opacity', 0)
            vm.clicked = vm.clicked.filter(s => s !== d.State_UT)
          } else {
            // clicking now
            d3.select(this)
              .attr('stroke', colors(vm.clicked.length))
              .attr('stroke-width', 5)
              .attr('opacity', 1)
            vm.clicked.push(d.State_UT)
          }
        })

      // Draw the labels and blocks in the descending order
      for (let i = 0; i < this.xColumns.length; i++) {
        const col = this.xColumns[i]
        this.csv.sort((a, b) => parseFloat(b[col]) - parseFloat(a[col]))
        const min = Math.floor(
          d3.min(this.csv.map(r => parseFloat(r[col]))) / 10
        )
        const max = Math.ceil(
          d3.max(this.csv.map(r => parseFloat(r[col]))) / 10
        )
        const levels = []
        for (let i = min; i <= max; i++) {
          levels.push(Math.floor(i) * 10)
        }

        const g = this.svg.append('g').attr('id', col + '_labels')
        const g2 = this.svg.append('g').attr('id', col + '_boxes')

        g.selectAll('text')
          .data(levels)
          .enter()
          .append('text')
          .attr('x', xPos(col) + 8)
          .attr('y', d => yPos(d))
          .text(d => d)
          .attr('font-size', '11px')
          .attr('font-family', 'sans-serif')
          .attr('alignment-baseline', 'hanging')

        // Add a line at the end to terminate the connectors
        this.svg
          .append('g')
          .attr('id', 'endline')
          .append('line')
          .attr('x1', xPos(col) + 2)
          .attr('x2', xPos(col) + 2)
          .attr('y1', yPos(min * 10))
          .attr('y2', yPos(max * 10))
          .attr('stroke', 'lightgrey')

        g2.selectAll('rect')
          .data(levels)
          .enter()
          .append('rect')
          .attr('x', xPos(col))
          .attr('y', d => yPos(d) + 2)
          // .attr('y', (d, i) => i * 25 + 30)
          .attr('height', '5px')
          .attr('width', '5px')
          .attr('fill', 'grey')
      }
    }
  }
}
</script>

<style scoped></style>
