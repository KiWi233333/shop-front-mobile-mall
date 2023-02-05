<template>
  <div class="text-load">
    <div class="text">{{ text }}</div>
    <div class="load"></div>
    <image class="image" v-if="image" :src="image" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      default: "need value prop",
    },
    delay: {
      required: false,
      default: "0.2s",
    },
    color: {
      required: false,
      default: "#000",
    },
    image: {
      required: false,
      default: "",
    },
  },
};
</script>

<style>
</style>