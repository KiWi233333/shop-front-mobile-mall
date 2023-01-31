<template>
  <div class="search-nav">
    <div class="nav">
      <!-- 返回 -->
      <van-icon
        name="arrow-left"
        size="0.6rem"
        @click="toBack"
        class="toback-btn"
      />
      <!-- 输入框 -->
      <van-field
        v-model="keyWords"
        @focus="focusKeywords"
        class="v-input search"
        placeholder="输入商品名称"
        :autofocus="true"
        left-icon="search"
      />
      <!-- 清除输入 -->
      <van-icon
        name="clear"
        size="0.6rem"
        class="clear"
        v-show="keyWords"
        color="var(--text-color3)"
        @click="clearKeywords"
      />
      <!-- 搜索按钮 -->
      <input type="button" value="搜 索" class="btn" @click="toSearchGoods" />
    </div>
    <div class="history" v-show="!isResult">
      <!-- 历史搜索记录 -->
      <div class="top">
        <span class="title">历史搜索</span>
        <van-icon
          name="delete-o"
          size="0.5rem"
          class="delete"
          @click="deleteHistory"
        />
      </div>
      <!-- 搜索列表 -->
      <div class="list">
        <div
          @touchstart="touchStartHistory"
          @touchend="touchEndHistory(i)"
          @click="clickHistory(p, i)"
          class="item"
          v-for="(p, i) in searchHistory"
          :key="i"
        >
          {{ p }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Dialog, Toast } from "vant";
export default {
  name: "SearchNav",
  props: ["isResult"],
  data() {
    return {
      keyWords: "", // 关键字
      timer: "", // 定时器
      searchHistory: [], // 搜索历史
      touchTime: 0,
    };
  },
  created() {
    const data = JSON.parse(localStorage.getItem("searchHistory")) || "";
    if (data !== "") {
      data.forEach((p) => {
        this.searchHistory.push(p);
      });
    }
  },
  methods: {
    // 搜索商品
    toSearchGoods() {
      if (this.keyWords.trim() === "")
        return Toast({ message: " 请输入搜索内容！" });
      // 显示搜索结果
      this.$emit("submitSearch", this.keyWords.trim());
      // 记录搜索历史
      this.searchHistory.unshift(this.keyWords.trim());
    },
    // 聚焦输入框
    focusKeywords() {
      this.$emit("focusKeywords", this.keyWords.trim());
    },
    // 关键字清空
    clearKeywords() {
      this.keyWords = "";
      this.$emit("clearKeywords", this.keyWords);
    },

    // 历史记录
    clickHistory(p, i) {
      this.keyWords = p;
      this.searchHistory.splice(i, 1).unshift(p);
      this.toSearchGoods(); // 搜索
    },
    // 删除历史记录
    deleteHistory() {
      if (this.searchHistory.length === 0) return;
      Dialog.confirm({
        message: "删除全部记录？",
        beforeClose: (action, done) => {
          if (action === "confirm") {
            this.searchHistory.splice(0);
            done();
          } else {
            done();
          }
        },
      }).catch(() => {});
    },

    // 移动端长按事件
    touchStartHistory() {
      this.touchTime = new Date();
    },
    touchEndHistory(i) {
      if (new Date() - this.touchTime > 400) {
        this.touchTime = 0;
        Dialog.confirm({
          message: "删除改条记录？",
          beforeClose: (action, done) => {
            if (action === "confirm") {
              this.searchHistory.splice(i, 1);
              done();
            } else {
              done();
            }
          },
        }).catch(() => {});
      }
    },

    // 返回
    toBack() {
      if (this.isResult && this.keyWords !== "") {
        this.focusKeywords(); // 回到历史记录
      } else {
        this.$router.back(); // 回到主页
      }
    },
  },
  watch: {
    // 变化就储存历史记录
    searchHistory: {
      deep: true,
      handler() {
        localStorage.setItem(
          "searchHistory",
          JSON.stringify(this.searchHistory)
        );
      },
    },
  },
};
</script>
<style scoped>
.nav {
  z-index: 99;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.toback-btn {
  cursor: pointer;
  padding-right: 0.2rem;
}
.btn {
  padding: 0;
  border: none;
  background: none;
  font-size: 0.4rem;
  padding: 0 0.3rem;
  cursor: pointer;
}
.search {
  width: 100%;
  padding: 0.15rem 0.3rem;
  margin: auto;
  border: 2px solid var(--theme-color2);
}
.clear {
  position: absolute;
  right: 2.1rem;
  cursor: pointer;
}
.history {
  padding: 0.4rem 0rem;
}
.title {
  font-weight: 600;
  padding: 0.2rem 0;
  font-size: 0.45rem;
}
.history .list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.2rem;
}
.history .list .item {
  margin: 0.15rem 0.2rem;
  padding: 0.15rem 0.3rem;
  border-radius: 0.4rem;
  background-color: rgba(128, 128, 128, 0.1);
  cursor: pointer;
}
.history .top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.2rem;
}
.delete {
  cursor: pointer;
}
</style>
