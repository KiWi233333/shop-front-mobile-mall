<template>
  <div class="wind-init search-view">
    <search-nav />
    <goods-list :type="params" />
  </div>
</template>
<script>
import SearchNav from "@/components/Home/SearchNav.vue";
import GoodsList from "@/components/Home/GoodsList.vue";
export default {
  components: { SearchNav, GoodsList },
  name: "SearchView",
  data() {
    return {
      params: { name: "" },
    };
  },
  methods: {},
};
</script>
<style scoped>
</style>