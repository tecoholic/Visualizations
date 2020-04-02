<template>
  <b-button id="download" @click="download()" type="is-light">
    <font-awesome-icon icon="download" /> Download as Image
  </b-button>
</template>

<script>
export default {
  name: 'DownloadAsImage',
  props: {
    selector: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    source: {
      type: String,
      required: false,
      default: ''
    },
    credits: {
      type: String,
      required: false,
      default: 'By ARUNMOZHI (@tecoholic)'
    }
  },
  computed: {
    fullSource: function() {
      return this.source ? 'Source: ' + this.source : ''
    }
  },
  methods: {
    download() {
      const viz = document.querySelector(this.selector)
      const canvas = document.createElement('canvas')
      canvas.width = viz.width.baseVal.value + 50
      canvas.height = viz.height.baseVal.value + 85

      const ctx = canvas.getContext('2d')

      // Fill the background with color
      ctx.beginPath()
      ctx.rect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'white'
      ctx.fill()

      // Add the title on top
      ctx.font = '18px sans-serif'
      ctx.fillStyle = 'black'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'hanging'
      ctx.fillText(this.title, canvas.width / 2, 15)

      // Add the credits at the bottom
      ctx.font = '11px sans-serif'
      ctx.fillStyle = 'grey'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'bottom'
      ctx.fillText(this.credits, 25, canvas.height - 15)

      // Add the Data Source
      ctx.font = '11px sans-serif'
      ctx.fillStyle = 'grey'
      ctx.textAlign = 'right'
      ctx.textBaseline = 'bottom'
      ctx.fillText(this.fullSource, canvas.width - 25, canvas.height - 15)

      const data = new XMLSerializer().serializeToString(viz)
      const DOMURL = window.URL || window.webkitURL || window

      const img = new Image()
      const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
      const url = DOMURL.createObjectURL(svgBlob)
      const self = this

      img.onload = function() {
        ctx.drawImage(img, 25, 50)
        DOMURL.revokeObjectURL(url)

        const imgURI = canvas.toDataURL('image/png')

        self.triggerDownload(imgURI)
      }

      img.src = url
    },
    triggerDownload(imgURI) {
      const evt = new MouseEvent('click', {
        view: window,
        bubbles: false,
        cancelable: true
      })

      const a = document.createElement('a')
      a.setAttribute('download', 'GER_India_States.png')
      a.setAttribute('href', imgURI)
      a.setAttribute('target', '_blank')

      a.dispatchEvent(evt)
    }
  }
}
</script>

<style></style>
