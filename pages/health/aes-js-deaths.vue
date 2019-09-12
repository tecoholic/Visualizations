<template>
  <section class="container">
    <top-nav></top-nav>
    <h2 class="text-lg my-3 font-bold w-full md:w-3/4">
      AES & JE Cases and Deaths
    </h2>
    <p class="my-2">
      State wise number of AES/JE Cases and Deaths from 2013-2018.
      <span class="text-red-500">Red</span> circles indicate Deaths.
      <span class="text-green-500">Green</span> circles indicate NO deaths
    </p>
    <p
      class="bg-blue-200 border-blue-400 border rounded-sm text-blue-900 md:hidden text-xs p-1 mb-3"
    >
      <font-awesome-icon icon="info-circle" />
      Zoom in to the visualization if text is too small
    </p>
    <div class="flex my-3">
      <div class="w-full md:w-1/2">
        <div class="inline">
          <label
            for="year"
            class="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mx-4"
          >
            Year
          </label>
          <div class="inline relative w-64">
            <select
              id="year"
              v-model.number="year"
              name="year"
              class="w-32 appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-1 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              @change="redraw()"
            >
              <option value="13">2013</option>
              <option value="14">2014</option>
              <option value="15">2015</option>
              <option value="16">2016</option>
              <option value="17">2017</option>
              <option value="18">2018</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2">
        <div class="inline">
          <label
            for="disease"
            class="uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 mx-4"
          >
            Disease
          </label>
          <div class="inline relative">
            <select
              id="disease"
              v-model="disease"
              name="year"
              class="appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-1 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              @change="changeDisease()"
            >
              <option value="aes">Acute Encephalitis Syndrome (AES)</option>
              <option value="je">Japanese Encephalitis (JE)</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap my-2">
      <div id="dia" class="w-full p-4 rounded shadow">
        <svg
          ref="viz"
          :viewBox="viewBox"
          preserveAspectRatio="xMinYMin meet"
          class="bg-white"
        ></svg>
        <div id="popup"></div>
      </div>
    </div>

    <div class="py-3">
      <p>
        <strong>Data Source: </strong>
        <a
          href="https://www.nvbdcp.gov.in/WriteReadData/l892s/69175758181557490094.pdf"
        >
          State wise number of AES/JE Cases and Deaths from 2013-2019(till
          April)
        </a>
        by Directorate of National Vector Borne Disease Control Programme -
        Delhi
      </p>
    </div>
  </section>
</template>

<script>
import * as d3 from 'd3'
import TopNav from '../../components/TopNav'

export default {
  name: 'AesJsDeaths',
  components: {
    TopNav
  },
  data: function() {
    return {
      csv: [],
      svg: null,
      width: 840,
      height: 500,
      innerRadius: 30,
      outerRadius: 245,
      xCol: '13-aes-cases',
      yCol: '13-aes-death',
      rows: [],
      year: 13,
      disease: 'aes',
      xScale: null,
      yScale: null,
      timer: null
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
      this.year = 13
      this.yCol = `${this.year}-${this.disease}-death`
      this.xCol = `${this.year}-${this.disease}-cases`
      this.draw()
    },
    updateGraph() {
      this.yCol = `${this.year}-${this.disease}-death`
      this.xCol = `${this.year}-${this.disease}-cases`
      const duration = 3000
      this.svg
        .selectAll('.state')
        .transition()
        .duration(duration)
        .attr('cx', d => this.xScale(+d[this.xCol]))
        .attr('cy', d => this.yScale(d.State))
        .attr('r', d => 2 + Math.sqrt(+d[this.yCol]))
        .attr('fill', d =>
          2 + Math.sqrt(+d[this.yCol]) > 2 ? 'red' : 'lightgreen'
        )

      this.svg
        .select('#year-text')
        .transition()
        .duration(1000)
        .text(`20${this.year}`)
    },
    redraw() {
      this.yCol = `${this.year}-${this.disease}-death`
      this.xCol = `${this.year}-${this.disease}-cases`
      this.updateGraph()
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
        .scaleLinear()
        .domain([0, d3.max(caseMaxes)])
        .range([100, this.width - 10])
      this.xScale = xScale

      const yScale = d3
        .scalePoint()
        .domain(states)
        .range([30, this.height - 50])
      this.yScale = yScale

      this.drawHeading()
      const points = this.svg
        .selectAll('g.state')
        .data(this.rows)
        .enter()
        .append('g')
        .attr('class', 'state')
        .attr('id', d => d.State)

      const vm = this
      points
        .append('circle')
        .attr('class', 'state')
        .attr('cx', d => xScale(+d[this.xCol]))
        .attr('cy', d => yScale(d.State))
        .attr('r', d => 2 + Math.sqrt(+d[this.yCol]))
        .attr('stroke', '#333333')
        .attr('stroke-width', 1)
        .attr('stroke-opacity', 0.5)
        .attr('fill', d => (+d[this.yCol] ? 'red' : 'lightgreen'))
        .on('mouseover', function(d) {
          const popup = d3
            .select('div#popup')
            .html(
              'Reported <b>Cases:</b> ' +
                d[vm.xCol] +
                '<br /><b>Deaths:</b> ' +
                d[vm.yCol]
            )
          popup
            .style('visibility', 'visible')
            .style('left', d3.event.pageX - 50 + 'px')
            .style('top', d3.event.pageY - 90 + 'px')
          d3.select(this).attr('fill', d =>
            +d[vm.yCol] ? '#ff9999' : '#e6ffe6'
          )
        })
        .on('mousemove', function(d) {
          d3.select('div#popup')
            .style('left', d3.event.pageX - 50 + 'px')
            .style('top', d3.event.pageY - 90 + 'px')
        })
        .on('mouseout', function(d) {
          d3.select(this).attr('fill', d =>
            +d[vm.yCol] ? 'red' : 'lightgreen'
          )
          d3.select('div#popup').style('visibility', 'hidden')
        })

      const xAxis = d3
        .axisBottom(xScale)
        .tickSize(-(this.height - 60))
        .tickPadding(5)

      this.svg
        .append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${this.height - 35})`)
        .call(xAxis)
        .attr('stroke-dasharray', '2,2')
        .select('.domain')
        .remove()

      this.svg
        .select('g#x-axis')
        .append('text')
        .attr('x', this.width / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .text('Reported Cases')
        .attr('fill', 'black')
        .attr('font-size', '12')

      const yAxis = d3
        .axisLeft(yScale)
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
    drawHeading() {
      const headers = this.svg.append('g').attr('id', 'g-headers')

      headers
        .append('text')
        .attr('id', 'year-text')
        .text(`20${this.year}`)
        .attr('x', this.width - 100)
        .attr('y', 75)
        .attr('font-size', '32')
        .attr('opacity', 0.2)
        .attr('fill', 'red')

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
  stroke-opacity: 0.2;
}
.tick text {
  font-size: 9px;
  fill: #67696e;
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
