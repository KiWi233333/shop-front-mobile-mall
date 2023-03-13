<template>
  <div class="category-view">
    <div class="content">
      <van-sidebar v-model="activeKey">
        <van-sidebar-item
          class="left-nav"
          v-for="p in firstSortList"
          :key="p.id"
          :title="p.name"
        />
      </van-sidebar>
      <div class="right">
        <div
          class="item v-click"
          @click="toSortView(p.id)"
          v-for="(p, i) in secondSortList"
          :key="i"
        >
          <img :src="getImgSrc(p.icon)" />
          <span class="tip">{{ p.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirstSortList, getSecondSortList } from "@/api/good/good";
import { getResourImageByName } from "@/api/res";
import { Toast } from "vant";
export default {
  name: "CategoryView",
  data() {
    return {
      activeKey: -1,
      firstSortList: [], // 导航栏信息
      secondSortList: [],
    };
  },

  created() {
    // 获取所有的一级分类
    getFirstSortList()
      .then((res) => {
        if (res.data.code === 20011) {
          // 同步操作
          for (let p of res.data.data) {
            this.firstSortList.push(p);
          }

          if (this.$route.query.id >= 0 && this.$route.name == "category") {
            // 获取首页分类的下标
            this.activeKey = this.$route.query.id;
          } else {
            // 初始化
            this.activeKey = 0;
          }
        }
      })
      .catch(() => {
        Toast({ message: "网络错误，请稍后再试！" });
      });
  },
  methods: {
    // 获取对应的二级分类
    getSecondList(id) {
      this.secondSortList.splice(0);
      getSecondSortList(id)
        .then((res) => {
          if (res.data.code === 20011) {
            res.data.data.forEach((p) => {
              this.secondSortList.push(p);
            });
          }
        })
        .catch(() => {
          Toast({ message: "网络错误，请稍后再试！" });
        });
    },

    // 获取图片地址
    getImgSrc(icon) {
      return getResourImageByName(icon);
    },

    // 去到搜索分类页面
    toSortView(cid) {
      this.$router.push({
        name: "search",
        params: {
          animate: "forward",
        },
        query: {
          cid,
        },
      });
    },
  },
  watch: {
    activeKey(newVal, oldVal) {
      // 加载二级菜单
      if (newVal !== oldVal) {
        this.getSecondList(this.firstSortList[newVal].id);
      }
    },
    $route: {
      handler(to) {
        if (to.query.id >= 0 && to.name == "category") {
          // 获取首页分类的下标
          this.activeKey = to.query.id;
        }
      },
    },
  },
};
</script>
<style scoped>
.content {
  position: relative;
}
.content .right {
  position: absolute;
  right: 0;
  top: 0;
  width: 80%;
  display: flex;
  padding: 0.2rem;
}
.right .item {
  cursor: pointer;
  width: 25%;
  padding: 0.2rem;
  text-align: center;
  font-size: 0.3rem;
}
.right .item img {
  box-sizing: border-box;
  display: block;
  width: 1.6rem;
  height: 1.6rem;
  object-fit: contain;
  border-radius: 10px;
  box-shadow: var(--shadow-color3);
  margin-bottom: 0.2rem;
}

.van-sidebar {
  height: 100vh;
  width: 20%;
  background-color: #f7f8fa;
}
.van-sidebar-item {
  font-size: 0.4rem;
  width: 100%;
  height: 1.35rem;
  display: flex;
  align-items: center;
}
.van-sidebar-item::before {
  background-color: var(--theme-color2);
}
</style>
