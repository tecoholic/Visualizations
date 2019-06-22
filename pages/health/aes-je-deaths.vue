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
      width: 900,
      height: 1000,
      innerRadius: 30,
      outerRadius: 245,
      xCol: '13-aes-cases',
      yCol: '13-aes-death',
      rows: [],
      year: 13,
      disease: 'aes',
      xScale: null,
      yScale: null,
      timer: null,
      caseScale: null,
      deathScale: null
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
    animate() {
      if (this.year < 18) {
        this.year += 1
        this.updateGraph()
        this.timer = setTimeout(this.animate, 3000)
      }
    },
    changeDisease() {
      this.svg.selectAll('*').remove()
      this.draw()
    },
    draw() {
      const caseMaxes = []
      const deathMaxes = []
      const separator = this.width * 0.33
      const topMargin = 30
      const bottomMargin = 15
      const years = [13, 14, 15, 16, 17, 18]
      const states = this.csv.map(r => r.State)

      this.csv.columns
        .slice(1)
        .filter(col => col.indexOf(this.disease) !== -1)
        .forEach((col, idx) => {
          if (idx % 2) {
            deathMaxes.push(d3.max(this.csv.map(row => +row[col])))
          } else {
            caseMaxes.push(d3.max(this.csv.map(row => +row[col])))
          }
        })

      this.caseScale = d3
        .scaleLinear()
        .domain([0, d3.max(caseMaxes)])
        .range([separator, this.width])

      this.deathScale = d3
        .scaleLinear()
        .domain([0, d3.max(deathMaxes)])
        .range([separator - 2, 0])

      this.stateBands = d3
        .scaleBand()
        .domain(states)
        .range([topMargin, this.height - bottomMargin])
        .padding(0.5)

      this.drawHeading()
      this.drawAxes()

      const drawBars = row => {
        const barScale = state =>
          d3
            .scalePoint()
            .domain(years)
            .range([
              this.stateBands(state),
              this.stateBands(state) + this.stateBands.bandwidth()
            ])

        this.csv.columns.slice(1).forEach(col => {
          row
            .append('line')
            // .attr('d', d => line(points(d, col)))
            .attr('x1', () =>
              col.indexOf('death') === -1
                ? this.caseScale(0)
                : this.deathScale(0)
            )
            .attr('x2', d =>
              col.indexOf('death') === -1
                ? this.caseScale(+d[col])
                : this.deathScale(+d[col])
            )
            .attr('y1', d => barScale(d.State)(+col.substring(0, 2)))
            .attr('y2', d => barScale(d.State)(+col.substring(0, 2)))
            .attr('stroke', col.indexOf('death') === -1 ? 'gray' : 'red')
            .attr('stroke-width', 3)
            .attr('stroke-linecap', 'round')
        })
      }

      this.svg
        .selectAll('g.state')
        .data(this.csv)
        .enter()
        .append('g')
        .attr('class', 'state')
        .attr('id', d => d.State)
        .call(drawBars)

      this.drawStateLabels()
    },
    drawAxes() {
      this.svg
        .append('g')
        .attr('class', 'deaths-axes')
        .attr('transform', 'translate(0, 30)')
        .call(
          d3
            .axisTop(this.deathScale)
            .ticks(6)
            .tickSize(-this.height + 50)
        )
        .select('.domain')
        .remove()

      this.svg
        .append('g')
        .attr('class', 'deaths-axes')
        .attr('transform', 'translate(-2, 30)')
        .call(
          d3
            .axisTop(this.caseScale)
            .ticks(10)
            .tickSize(-this.height + 50)
        )
        .select('.domain')
        .remove()

      this.svg
        .append('g')
        .attr('class', 'deaths-axes')
        .attr('transform', `translate(0, ${this.height - 20})`)
        .call(
          d3
            .axisBottom(this.deathScale)
            .ticks(6)
            .tickSize(0)
        )
        .select('.domain')
        .remove()

      this.svg
        .append('g')
        .attr('class', 'deaths-axes')
        .attr('transform', `translate(-2, ${this.height - 20})`)
        .call(
          d3
            .axisBottom(this.caseScale)
            .ticks(10)
            .tickSize(0)
        )
        .select('.domain')
        .remove()
    },
    drawStateLabels() {
      this.svg
        .append('g')
        .attr('id', 'state-labels')
        .selectAll('text')
        .data(this.csv)
        .enter()
        .append('text')
        .attr('class', 'state-label')
        .text(d => d.State)
        .attr('font-size', '10')
        .attr('font-weight', 'bold')
        .attr('fill', 'black')
        .attr('x', this.width * 0.33)
        .attr(
          'y',
          d => this.stateBands(d.State) - this.stateBands.bandwidth() / 2
        )
        .attr('dy', '0.5em')
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
        .attr('x', this.width * 0.33)
        .attr('y', 10)
        .attr('font-size', '13')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .attr('fill', '#333333')
    }
  }
}
</script>

<style>
.tick line,
.domain {
  stroke-width: 0.5;
  stroke-opacity: 0.25;
}
.tick text {
  font-size: 9px;
  fill: #67696e;
}
</style>
