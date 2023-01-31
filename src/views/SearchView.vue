<template>
  <div class="wind-init search-view">
    <search-nav
      @submitSearch="submitSearch"
      @focusKeywords="focusKeywords"
      :isResult="isResult"
    />
    <search-toggle :keyWords="keyWords" v-if="isResult" />
  </div>
</template>
<script>
import SearchNav from "@/components/Search/SearchNav.vue";
import SearchToggle from "@/components/Search/SearchToggle.vue";
import { Toast } from "vant";
export default {
  components: { SearchNav, SearchToggle },
  name: "SearchView",
  data() {
    return {
      keyWords: "", // 关键字
      isResult: false,
    };
  },
  methods: {
    submitSearch(value) {
      this.isResult = false;
      if (value === "") return Toast({ message: " 请输入搜索内容！" });
      this.keyWords = value;
      this.isResult = true;
    },
    focusKeywords(value) {
      this.keyWords = value;
      this.isResult = false;
    },
  },
};
</script>
<style scoped>
</style>