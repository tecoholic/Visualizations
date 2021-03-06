<template>
  <section class="container section">
    <h2 class="title">
      Wealth Inequality Across Caste Groups In India
    </h2>
    <p class="content">
      This Visualization shows the distribution of communities across the wealth
      spectrum.
    </p>

    <p class="content">
      <strong>Data Source: </strong>
      <a
        href="https://wid.world/document/n-k-bharti-wealth-inequality-class-and-caste-in-india-1961-2012/"
      >
        World Inequality Database - Wealth Inequality, Class and Caste in India,
        1961-2012 by <em>Nitin Kumar Bharti</em>
      </a>
    </p>

    <b-notification :closable="false" type="is-info" class="is-hidden-desktop">
      <font-awesome-icon icon="info-circle" />
      Zoom in to the visualization if text is too small
    </b-notification>

    <div class="columns">
      <div class="column">
        <b-button @click="changeChartType()" type="is-primary">
          Switch to {{ chartType }}
        </b-button>
      </div>
    </div>

    <div class="columns">
      <div class="column is-two-thirds">
        <svg
          ref="viz"
          :viewBox="viewBox"
          preserveAspectRatio="xMinYMin meet"
          class="bg-white"
        ></svg>
      </div>
      <div class="column is-one-third">
        <table class="table">
          <tr v-if="csv.columns">
            <th v-for="col in csv.columns" :key="col">
              {{ col }}
            </th>
          </tr>
          <tr v-for="(row, index) in csv" :key="index">
            <td v-for="col in csv.columns" :key="'r' + index + col">
              {{ row[col] }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </section>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'WealthIndex',
  data: function() {
    return {
      csv: [],
      svg: null,
      width: 840,
      height: 500,
      chartType: 'Stacked Barchart'
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
      title: 'Wealth Inequality Across Caste Groups In India',
      meta: [
        {
          hid: 'og_title',
          name: 'og:title',
          content: 'Wealth Inequality Across Caste Groups In India'
        },
        {
          hid: 'description',
          name: 'description',
          content:
            'Visualization of the Wealth Inequality using the data from World Inequality Database study by Nitin Kumar Bharati'
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
      this.csv = await d3.csv('/data/wealthindex-NFHS-2005.csv')
      this.drawCircles()
    },
    changeChartType: function() {
      if (this.chartType === 'Stacked Barchart') {
        this.drawStackedChart()
      } else {
        this.drawCircles()
      }
    },
    unwrapColumns: function(d) {
      return this.csv.columns
        .slice(1)
        .map(col => ({ value: d[col], community: d.Category, wealth: col }))
    },
    drawCircles() {
      this.chartType = 'Stacked Barchart'
      this.svg.selectAll('*').remove()

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
    },
    drawStackedChart: function() {
      this.chartType = 'Bubble Chart'
      this.svg.selectAll('*').remove()

      const stack = d3
        .stack()
        .keys(this.csv.columns.slice(1))
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone)
      const series = stack(this.csv)

      const x = d3
        .scaleBand()
        .domain(this.csv.map(d => d.Category))
        .range([10, this.width - 100])
        .padding(0.3)

      const y = d3
        .scaleLinear()
        .domain([0, 100.1])
        .range([this.height - 50, 10])

      const color = d3
        .scaleOrdinal()
        .domain(series.map(d => d.key))
        .range(
          d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), series.length)
        )
        .unknown('#ccc')

      const xAxis = g =>
        g
          .attr('transform', `translate(0, ${this.height - 50})`)
          .call(
            d3
              .axisBottom(x)
              .tickSize(0)
              .tickPadding(5)
          )
          .call(g => g.selectAll('.domain').remove())
          .attr('font-size', 12)

      const yAxis = g =>
        g
          .attr('transform', `translate(20,0)`)
          .call(
            d3
              .axisLeft(y)
              .tickSize(0)
              .tickSizeInner(-this.width + 100)
          )
          .call(g => g.selectAll('.domain').remove())
          .attr('font-size', 12)

      const legend = svg => {
        const g = svg
          .attr('font-family', 'sans-serif')
          .attr('font-weight', 'bold')
          .attr('font-size', 12)
          .attr('text-anchor', 'end')
          .attr('transform', `translate(${this.width}, 30)`)
          .selectAll('g')
          .data(series.slice().reverse())
          .join('g')
          .attr('transform', (d, i) => `translate(0,${i * 25})`)

        g.append('rect')
          .attr('x', -20)
          .attr('width', 20)
          .attr('height', 20)
          .attr('fill', d => color(d.key))

        g.append('text')
          .attr('x', -24)
          .attr('y', 9.5)
          .attr('dy', '0.5em')
          .text(d => d.key)
      }

      this.svg.append('g').call(xAxis)
      this.svg.append('g').call(yAxis)
      this.svg.append('g').call(legend)
      this.svg
        .append('g')
        .selectAll('g')
        .data(series)
        .join('g')
        .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', (d, i) => x(d.data.Category))
        .attr('y', d => y(d[1]))
        .attr('height', d => y(d[0]) - y(d[1]))
        .attr('width', x.bandwidth())
    }
  }
}
</script>

<style>
.tick line {
  stroke: #ccc;
}
</style>
