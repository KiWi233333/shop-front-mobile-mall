<template>
  <default-page :title="`评论 (${0})`">
    <van-tabs
      v-model="activeBar"
      sticky
      animated
      lazy-render
      swipeable
      color="var(--theme-color2)"
      title-active-color="var(--theme-color2)"
      @change="changeNav"
    >
      <van-tab
        v-for="(p, i) in option"
        :key="i"
        :title="p.title"
        :name="p.name"
      >
      </van-tab>
    </van-tabs>
  </default-page>
</template>
  
  <script>
import DefaultPage from "@/components/DefaultPage.vue";
export default {
  name: "CommentView",
  components: { DefaultPage },
  data() {
    return {
      activeBar: 0,
      option: [
        { name: 0, title: "综合", sort: 0 },
        { name: 1, title: "最新", sort: 1 },
      ],
    };
  },

  methods: {
    changeNav() {
      console.log();
    },
  },
};
</script>
<style scpoed>
</style>