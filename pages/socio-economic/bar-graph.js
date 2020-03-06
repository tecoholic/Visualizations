import * as d3 from 'd3'

export default class BarGraph {
  constructor(svg, width, height) {
    this.svg = d3.select(svg)
    this.height = height
    this.width = width
    this.data = [3, 2, 4, 5, 7, 8]
  }

  draw() {
    const barWidth = 25
    console.log('SVG: ', this.svg)

    const height = d3
      .scaleLinear()
      .domain([0, d3.max(this.data)])
      .range([0, this.height])

    this.svg
      .append('g')
      .selectAll('rect')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 30)
      .attr('y', d => this.height - height(d))
      .attr('width', barWidth)
      .attr('height', d => height(d))
      .attr('fill', 'grey')
      .attr('title', d => d)
  }
}
