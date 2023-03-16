<template>
  <div class="view">
    <top-nav
      :title="title"
      @click-left="toBack()"
      :r-title="rtitle"
      @click-right="clickRight"
    />
    <div class="content">
      <!-- 内容 -->
      <slot name="default"></slot>
    </div>
  </div>
</template>
<script>
import TopNav from "@/components/TopNav.vue";
export default {
  props: {
    // 标题
    title: {
      type: String,
      default: "",
      required: false,
    },
    // left
    ltitle: {
      type: String,
      default: "",
      required: false,
    },
    // right
    rtitle: {
      type: String,
      default: "",
      required: false,
    },
  },
  components: { TopNav },
  name: "DefaultPage",
  methods: {
    clickRight() {
      this.$emit("clickRight");
    },
    toBack() {
      if (this.$route.params.animate) {
        this.$router.back();
      } else {
        this.$router.push({
          name: "home",
          params: {
            animate: "forward",
          },
        });
      }
    },
  },
};
</script>
<style scoped>
.content {
  padding: 0.1rem 0.3rem;
}
</style>