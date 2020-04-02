<template>
  <section class="container section">
    <h2 class="title">
      NEET PG 2019 Results - State-wise numbers and pass percentage
    </h2>
    <p class="content">
      This graph show the number of candidates who appeared for PG NEET 2019 vs
      the number of candidates qualified. The diagonal lines indicate the pass
      percentage. <br />
    </p>
    <p class="content">
      <strong>Source:</strong>
      <a :href="source">
        PRESS RELEASE - National Board of Examinations New Delhi
      </a>
    </p>
    <b-notification :closable="false" class="is-hidden-desktop" type="is-info">
      <font-awesome-icon icon="info-circle" />
      Zoom in to the visualization if text is too small
    </b-notification>
    <div class="section">
      <figure class="image">
        <svg
          ref="viz"
          :viewBox="viewBox"
          preserveAspectRatio="xMinYMin meet"
        ></svg>
      </figure>
    </div>
  </section>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'NEETPG2019',
  data: function() {
    return {
      source:
        'https://natboard.edu.in/pdoof/pbnotice2019/PRESS%20NOTE%20-%20NEET-PG%202019%20RESULT.pdf',
      csv: [],
      svg: null,
      width: 900,
      height: 600,
      bottom: 40,
      left: 50,
      top: 20
    }
  },
  computed: {
    viewBox: function() {
      return `0 0 ${this.width} ${this.height}`
    }
  },
  head() {
    return {
      title: 'NEET PG Results 2019 - State wise quantity and quality',
      meta: [
        {
          hid: 'og_title',
          name: 'og:title',
          content: 'NEET PG Results 2019 - State wise quantity and quality'
        },
        {
          hid: 'description',
          name: 'description',
          content:
            'A visualization showing the NEET PG 2019 data showing the number of ' +
            'students who appeared for the test from each state and the number of' +
            ' students who cleared it.'
        },
        {
          hid: 'twitter_card',
          name: 'twitter:card',
          content: 'summary'
        }
      ]
    }
  },
  mounted() {
    this.svg = d3.select(this.$refs.viz)
    this.fetchGerData().then(this.renderViz)
  },
  methods: {
    async fetchGerData() {
      this.csv = await d3.csv('/data/NEET-PG-2019.csv')
    },
    renderViz() {
      /* -------------------   Scales and axis  ------------------------ */
      const maxAppeared = d3.max(this.csv.map(row => +row.appeared))
      const maxQualified = d3.max(this.csv.map(row => +row.qualified))
      const xScale = d3
        .scaleLinear()
        .domain([0, maxAppeared])
        .range([this.left, this.width - 10])
      const yScale = d3
        .scaleLinear()
        .domain([0, maxQualified])
        .range([this.height - this.bottom, this.top])
      const xAxis = d3.axisBottom(xScale)
      const yAxis = d3.axisLeft(yScale)
      this.svg
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${this.height - this.bottom})`)
        .call(xAxis)
      this.svg
        .append('g')
        .attr('id', 'y-axis')
        .attr('transform', `translate(${this.left},0)`)
        .call(yAxis)

      /* ----------------- Pass percentage lines --------------- */
      const pctLines = this.svg.append('g').attr('id', 'pct-lines')

      const pcts = [1, 0.8, 0.6, 0.4, 0.2]
      pcts.forEach(pct => {
        const y = maxAppeared * pct
        const yend = y < maxQualified ? yScale(y) : 10
        const xend =
          yend === 10 ? xScale(maxQualified / pct) : xScale(maxAppeared)
        pctLines
          .append('line')
          .attr('x1', xScale(0))
          .attr('y1', yScale(0))
          .attr('x2', xend)
          .attr('y2', yend)
          .attr('stroke', d3.interpolateSpectral(pct))
          .attr('stroke-opacity', 0.5)

        pctLines
          .append('text')
          .attr('x', yend === 10 ? xend - 10 : xend)
          .attr('y', yend === 10 ? 20 : yend)
          .text(`${pct * 100}%`)
          .attr('fill', d3.interpolateSpectral(pct))
          .attr('font-size', '10px')
          .attr('text-anchor', 'end')
      })

      /* --------------------- Marker Lines ------------------- */
      const markerStates = [
        'Jammu and Kashmir',
        'Chattisgarh',
        'Jharkhand',
        'Himachal Pradesh',
        'Tripura',
        'Chandigarh',
        'Meghalaya'
      ]
      this.csv.forEach(row => {
        if (markerStates.indexOf(row.state) === -1) return
        this.svg
          .append('line')
          .attr('class', 'marker-line')
          .attr('x1', xScale(+row.appeared))
          .attr('y1', yScale(+row.qualified))
          .attr('x2', xScale(+row.appeared) + parseInt(row.xoffset))
          .attr('y2', yScale(+row.qualified) + parseInt(row.yoffset))
          .attr('stroke', '#AAAAAA')
          .attr('stroke-width', 0.5)
      })

      /* -------------------   States  ------------------------ */
      const states = this.svg
        .append('g')
        .attr('id', 'states')
        .selectAll('g')
        .data(this.csv)
        .enter()
        .append('g')
        .attr('id', d => d.state)

      states
        .append('circle')
        .attr('cx', d => xScale(+d.appeared))
        .attr('cy', d => yScale(+d.qualified))
        .attr('r', 2.5)
        .attr('fill', '#90CDF4')
        .attr('stroke', '#2b4488')
        .attr('stroke-width', 0.5)

      /* --------------------- State Labels ------------------- */

      states
        .append('text')
        .attr('x', d => xScale(+d.appeared) + parseInt(d.xoffset))
        .attr('y', d => yScale(+d.qualified) + parseInt(d.yoffset))
        .text(d => d.state)
        .attr('font-size', '10px')
        .attr('fill', '#333333')

      /* -------------------- Axis Headers --------------------- */
      this.svg
        .select('#y-axis')
        .append('text')
        .attr('x', 0)
        .attr('y', (this.height - this.bottom) / 2)
        .attr('text-anchor', 'middle')
        .text('Candidates who Qualified PG NEET')
        .attr('fill', 'black')
        .attr('font-size', '11px')
        .attr(
          'transform',
          `rotate(-90, 20, ${(this.height - this.bottom) /
            2})translate(0,-${this.left + 11})`
        )

      this.svg
        .select('#x-axis')
        .append('text')
        .attr('x', this.width / 2)
        .attr('y', 35)
        .text('Candidates who appeared for PG NEET')
        .attr('fill', 'black')
        .attr('font-size', '11px')
        .attr('text-anchor', 'middle')
    }
  }
}
</script>

<style>
.tick line,
.domain {
  stroke-width: 0.5;
  stroke-opacity: 0.7;
}
.tick text {
  font-size: 9px;
  fill: #5a5c61;
}
</style>
