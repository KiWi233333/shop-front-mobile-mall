<template>
  <div class="wind-init search-view">
    <search-nav
      @submitSearch="submitSearch"
      @focusKeywords="focusKeywords"
      @clearKeywords="clearKeywords"
      :is-result="isResult"
    />
    <search-toggle
      :key-words="keyWords"
      :cid="this.$route.query?.cid"
      v-if="isResult"
    />
  </div>
</template>
<script>
import SearchNav from "@/components/Search/SearchNav.vue";
import SearchToggle from "@/components/Search/SearchToggle.vue";
export default {
  components: { SearchNav, SearchToggle },
  name: "SearchView",
  data() {
    return {
      keyWords: "", // 关键字
      isResult: false,
    };
  },
  created() {
    if (this.$route.query?.cid) {
      this.isResult = false;
      this.submitSearch();
      this.isResult = true;
    }
  },
  methods: {
    submitSearch(value) {
      this.isResult = false;
      this.keyWords = value;
      this.isResult = true;
    },
    focusKeywords(value) {
      this.keyWords = value;
      this.isResult = false;
    },
    clearKeywords(value) {
      this.keyWords = value;
    },
  },
};
</script>
<style scoped>
</style>