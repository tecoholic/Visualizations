<template>
  <section class="container section">
    <h2 class="title">
      AES & JE Cases and Deaths
    </h2>
    <p class="content">
      State wise number of AES/JE Cases and Deaths from 2013-2018.
    </p>
    <p class="content">
      <strong>Data Source: </strong>
      <a
        href="https://www.nvbdcp.gov.in/WriteReadData/l892s/69175758181557490094.pdf"
      >
        State wise number of AES/JE Cases and Deaths from 2013-2019(till April)
      </a>
      by Directorate of National Vector Borne Disease Control Programme - Delhi
    </p>
    <div class="columns">
      <div class="column">
        <b-field label="Select a Disease" horizontal>
          <b-select v-model="disease" @change.native="changeDisease()">
            <option value="aes">Acute Encephalitis Syndrome (AES)</option>
            <option value="je">Japanese Encephalitis (JE)</option>
          </b-select>
        </b-field>
      </div>
    </div>

    <b-notification :closable="false" type="is-info" class="is-hidden-desktop">
      <font-awesome-icon icon="info-circle" />
      &nbsp; Zoom in to the visualization if text is too small
    </b-notification>
    <div class="columns">
      <div class="column">
        <svg
          ref="viz"
          :viewBox="viewBox"
          preserveAspectRatio="xMinYMin meet"
          class="bg-white"
        ></svg>
      </div>
    </div>
    <div id="popup"></div>
  </section>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'AesJsDeaths',
  data: function() {
    return {
      csv: [],
      svg: null,
      width: 600,
      height: 750,
      rows: [],
      year: 2013,
      disease: 'aes',
      xScale: null,
      yScale: null,
      colorScale: null,
      years: [2013, 2014, 2015, 2016, 2017, 2018]
    }
  },
  computed: {
    viewBox: function() {
      return `0 0 ${this.width} ${this.height}`
    }
  },
  mounted() {
    this.svg = d3.select(this.$refs.viz)
    this.renderViz()
  },
  head() {
    return {
      title: 'AES JS Reports and Deaths 2013-18',
      meta: [
        {
          hid: 'og_title',
          name: 'og:title',
          content: 'AES JE Reports and Deaths 2013-18'
        },
        {
          hid: 'description',
          name: 'description',
          content: ''
        },
        {
          hid: 'twitter_card',
          name: 'twitter:card',
          content: 'summary'
        }
      ]
    }
  },
  methods: {
    async renderViz() {
      this.csv = await d3.csv('/data/aes-je-2013-18.csv')
      this.draw()
    },
    changeDisease() {
      this.svg.selectAll('*').remove()
      this.draw()
    },
    draw() {
      this.rows = this.csv
      const caseMaxes = []
      const deathMaxes = []
      const states = this.csv.map(row => row.State)

      this.csv.columns
        .slice(1)
        .filter(col => col.indexOf(this.disease) !== -1)
        .forEach((col, idx) => {
          if (idx % 2) {
            deathMaxes.push(d3.max(this.rows.map(row => +row[col])))
          } else {
            caseMaxes.push(d3.max(this.rows.map(row => +row[col])))
          }
        })

      const xScale = d3
        .scalePoint()
        .domain(this.years)
        .range([120, this.width - 30])
      this.xScale = xScale

      const yScale = d3
        .scalePoint()
        .domain(states)
        .range([50, this.height - 30])
      this.yScale = yScale
      this.colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([20, 0])

      console.log(this.colorScale(100))

      this.drawHeading()
      this.drawAxes()

      const points = this.svg
        .selectAll('g.state')
        .data(this.rows)
        .enter()
        .append('g')
        .attr('class', 'state')
        .attr('id', d => d.State)
      this.years.forEach(year => {
        this.year = year
        this.drawCircles(points)
      })
    },
    drawAxes() {
      const xAxis = d3
        .axisTop(this.xScale)
        .tickSize(0)
        .tickPadding(5)

      this.svg
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,40)`)
        .call(xAxis)
        .attr('stroke-dasharray', '2,2')
        .select('.domain')
        .remove()

      const yAxis = d3
        .axisLeft(this.yScale)
        .tickSize(-this.width)
        .tickPadding(5)

      this.svg
        .append('g')
        .attr('transform', 'translate(90,0)')
        .attr('id', 'y-axis')
        .call(yAxis)
        .select('.domain')
        .remove()
    },
    drawCircles(points) {
      const deathsCol = `${this.year - 2000}-${this.disease}-death`
      const casesCol = `${this.year - 2000}-${this.disease}-cases`
      const containerBox = document
        .querySelector('.container')
        .getBoundingClientRect()

      points
        .append('circle')
        .attr('class', 'state')
        .attr('cx', d => this.xScale(this.year))
        .attr('cy', d => this.yScale(d.State))
        .attr('r', d => {
          const r = Math.sqrt(+d[casesCol] / 8)
          return r ? 2 + r : 0
        })
        .attr('stroke', '#666666')
        .attr('stroke-width', 0.5)
        .attr('fill', d => this.colorScale(+d[deathsCol]))
        .on('mouseover', function(d) {
          const popup = d3
            .select('div#popup')
            .html(
              '<b>Cases:</b> ' +
                d[casesCol] +
                '<br /><b>Deaths:</b> ' +
                d[deathsCol]
            )
          popup
            .style('visibility', 'visible')
            .style('left', d3.event.pageX - containerBox.x - 50 + 'px')
            .style('top', d3.event.pageY - 140 + 'px')
          d3.select(this)
            .attr('stroke-width', 1)
            .attr('stroke', 'black')
            .attr('opacity', 0.5)
        })
        .on('mousemove', function(d) {
          d3.select('div#popup')
            .style('left', d3.event.pageX - containerBox.x - 50 + 'px')
            .style('top', d3.event.pageY - 140 + 'px')
        })
        .on('mouseout', function(d) {
          d3.select(this)
            .attr('opacity', 1)
            .attr('stroke-width', 0.5)
            .attr('stroke', '#666666')
          d3.select('div#popup').style('visibility', 'hidden')
        })
    },
    drawHeading() {
      const headers = this.svg.append('g').attr('id', 'g-headers')

      headers
        .append('text')
        .attr('id', 'title')
        .text(() =>
          this.disease === 'aes'
            ? 'Acute Encephalitis Syndrome (AES)'
            : 'Japanese Encephalitis (JE)'
        )
        .attr('x', this.width / 2)
        .attr('y', 15)
        .attr('font-size', '13')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('fill', '#333333')
    }
  }
}
</script>

<style>
.tick line {
  stroke-width: 0.5;
  stroke-opacity: 0.1;
}
.tick text {
  font-size: 9px;
  fill: #272b35;
}
#popup {
  position: absolute;
  border-radius: 5%;
  font-size: 0.8rem;
  z-index: 5;
  background-color: white;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  width: 100px;
  visibility: hidden;
  background-color: #eee;
}
</style>
