<template>
  <default-page title="评价详情"> {{ fid }} </default-page>
</template>

<script>
import DefaultPage from "@/components/DefaultPage.vue";
export default {
  name: "CommentDetail",
  components: { DefaultPage },
  data() {
    return { fid: "" };
  },
  mounted() {
    if (this.$route?.query.id) {
      this.fid = this.$route.query.id;
    }
  },
};
</script>
<style scpoed>
</style>