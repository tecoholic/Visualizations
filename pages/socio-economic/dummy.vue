<template>
  <div class="container section">
    <svg
      ref="viz"
      :viewBox="viewBox"
      preserveAspectRatio="xMinYMin meet"
      class="bg-white"
    ></svg>
  </div>
</template>

<script>
import BarGraph from './bar-graph'

export default {
  name: 'Dummy',
  data: function() {
    return {
      width: 1000,
      height: 500,
      svg: null
    }
  },
  computed: {
    viewBox: function() {
      return `0 0 ${this.width} ${this.height}`
    }
  },
  mounted() {
    this.svg = this.$refs.viz
    const barGraph = new BarGraph(this.svg, this.width, this.height)
    barGraph.draw()
  }
}
</script>

<style></style>
