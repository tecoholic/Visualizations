<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div v-if="image" class="media-left">
          <figure class="image">
            <img :src="image" />
          </figure>
        </div>
        <div class="media-content">
          <p class="title">{{ title }}</p>
          <p class="content">{{ content }}</p>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <a :href="link" class="card-footer-item">
        See Visualization &nbsp;&nbsp;
        <font-awesome-icon icon="arrow-circle-right" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeTile',
  props: {
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false,
      default: () => false
    },
    content: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  }
}
</script>

<style></style>
