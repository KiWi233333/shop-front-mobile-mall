<template >
  <div class="serch-toggle">
    <!-- 标题 -->
    <div class="topNav">
      <div
        class="nav-item"
        :class="active === i ? 'active' : ''"
        v-for="(p, i) in option"
        :key="i"
        @click="changeNav(i)"
      >
        <span>{{ p.title }}</span>
      </div>
    </div>
    <van-tabs
      class="tabs"
      v-model="active"
      line-width="1.6rem"
      color="var(--theme-color2)"
      animated
    >
      <!-- 筛选条件 -->
      <van-tab v-for="(p, i) in option" :key="i">
        <!-- 商品列表 -->
        <goods-list :type="{ ...p.type }" />
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import GoodsList from "@/components/GoodsList.vue";
export default {
  name: "SearchToggle",
  components: { GoodsList },
  props: ["keyWords", "cid"],
  data() {
    return {
      active: 0,
      isSaleDes: true, // 是否降序
      isPriceDes: false, // 是否降序
      option: [
        {
          title: "全部",
          type: { cid: this.cid, name: this.keyWords || "" },
        },
        {
          title: "新品",
          type: { cid: this.cid, name: this.keyWords || "", isNew: 1 },
        },
        {
          title: "销量降序",
          type: { cid: this.cid, name: this.keyWords || "", saleSort: "Des" },
        },
        {
          title: "价格升序",
          type: { cid: this.cid, name: this.keyWords || "", priceSort: "Asc" },
        },
      ],
    };
  },
  // mounted() {
  //   console.log(this.option);
  // },
  methods: {
    changeNav(i) {
      if (this.active == i) {
        if (i == 2) this.isSaleDes = !this.isSaleDes;
        if (i == 3) this.isPriceDes = !this.isPriceDes;
      } else {
        this.active = i;
      }
    },
  },
  watch: {
    // 升序降序
    isSaleDes() {
      this.$set(
        this.option[2],
        "title",
        this.isSaleDes ? "销量降序" : "销量升序"
      );
      this.$set(
        this.option[2].type,
        "saleSort",
        this.isSaleDes ? "Des" : "Asc"
      );
    },
    isPriceDes() {
      this.$set(
        this.option[3],
        "title",
        this.isPriceDes ? "价格降序" : "价格升序"
      );
      this.$set(
        this.option[3].type,
        "priceSort",
        this.isPriceDes ? "Des" : "Asc"
      );
      this.$set(this.option[3], "priceSort", this.isPriceDes ? "Des" : "Asc");
    },
  },
};
</script>
<style scoped>
.tabs {
  width: 100%;
  height: auto;
  margin-top: -50px;
}
.topNav {
  display: flex;
  justify-content: space-around;
  padding: 0.2rem 0;
  user-select: none;
  width: 100%;
  position: relative;
  cursor: pointer;
  z-index: 1;
}
.nav-item {
  flex: 1;
  margin: 0.2rem;
  text-align: center;
  transition: 0.4s;
}
.nav-item span {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.4rem;
  transition: 0.4s;
  position: relative;
}
.nav-item.active span {
  color: var(--theme-color4);
  transition: 0.4s;
}
</style>