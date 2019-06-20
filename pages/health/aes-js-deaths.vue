<template>
  <section class="container">
    <top-nav></top-nav>
    <h2 class="text-lg my-2 font-bold w-full md:w-3/4">
      AES & JS Cases and Deaths
    </h2>
    <p class="my-2">
      State wise number of AES/JE Cases and Deaths from 2013-2018
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
              v-model="year"
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
              @change="redraw()"
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
      outCol: '18-aes-cases',
      inCol: '18-aes-death',
      rows: [],
      year: 13,
      disease: 'aes'
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
          content: 'AES JS Reports and Deaths 2013-18'
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
    redraw() {
      this.inCol = `${this.year}-${this.disease}-death`
      this.outCol = `${this.year}-${this.disease}-cases`
      this.svg.selectAll('*').remove()
      this.draw()
    },
    draw() {
      this.rows = this.csv.filter(r => +r[this.outCol])

      const xScale = d3
        .scaleBand()
        .domain(this.rows.map(d => d.State))
        .range([0, 2 * Math.PI])
        .align(0)

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(this.rows.map(d => +d[this.outCol]))])
        .range([this.innerRadius, this.outerRadius])

      const graph = this.svg
        .selectAll('g')
        .data(this.rows)
        .enter()
        .append('g')
        .attr('id', d => d.State)
        .attr('transform', `translate(${this.width / 2}, ${this.height * 0.6})`)

      this.drawArcs(graph, this.outCol, xScale, yScale, '#607d8b')
      this.drawArcs(graph, this.inCol, xScale, yScale, '#f44336')

      // const angleOffset = -360.0 / this.csv.length / 2.0
      // const vm = this

      const label = this.svg
        .append('g')
        .selectAll('g')
        .data(this.rows)
        .enter()
        .append('g')
        .attr('text-anchor', 'middle')
        .attr('transform', d => {
          const angle =
            ((xScale(d.State) + xScale.bandwidth() / 2) * 180) / Math.PI
          const x = this.width / 2
          const y = this.height * 0.6
          const xOffset = x
          const yOffset = y - yScale(d[this.outCol]) - 40
          return `rotate(${angle},${x},${y})translate(${xOffset},${yOffset})`
        })

      label
        .append('text')
        .text(d => d.State)
        .attr('transform', function(d) {
          return (xScale(d.State) + xScale.bandwidth() / 2) % (2 * Math.PI) <
            Math.PI
            ? 'rotate(-90)translate(0,0)'
            : 'rotate(90)translate(0,0)'
        })
        .style('font-size', 10)
    },
    drawArcs(graph, column, x, y, fill) {
      graph
        .append('path')
        .attr('class', 'arc' + column)
        .attr(
          'd',
          d3
            .arc()
            .innerRadius(this.innerRadius)
            .outerRadius(d => y(d[column]))
            .startAngle(d => x(d.State))
            .endAngle(d => x(d.State) + x.bandwidth())
            .padAngle(0.1)
            .padRadius(this.innerRadius)
        )
        .attr('fill', fill)
        .attr('stroke', 'white')
    }
  }
}
</script>

<style scoped></style>
