<template>
  <div class="wind-init goods-detail">
    <!-- 顶部导航 -->
    <share-nav />
    <!-- 商品图片 -->
    <van-swipe v-show="!isError">
      <van-swipe-item>
        <van-image
          lazy-load
          :src="getImgSrc(item?.goods?.images)"
          class="imags"
        />
      </van-swipe-item>
      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }}/1</div>
      </template>
    </van-swipe>
    <!-- 主内容 -->
    <div class="content" v-show="!isError">
      <!-- 标题 -->
      <div class="v-card top">
        <div class="price">
          ￥<span class="big">{{ item?.price || "0.0" }}</span>
        </div>
        <div class="title">{{ item?.goods?.name }}</div>
        <div class="lable-group">
          <div class="lable">总销量：{{ item?.goods?.sale }}</div>
          <div class="lable">
            <van-icon name="location-o" />
            {{ item?.goods?.city }}
          </div>
        </div>
      </div>
      <!-- 规格 -->
      <div class="v-card center">
        <div class="label-group"></div>
      </div>
    </div>
    <!-- 底部导航 -->
    <div class="shop-nav">
      <van-goods-action>
        <van-goods-action-icon icon="chat-o" text="客服" color="#ee0a24" />
        <van-goods-action-icon icon="cart-o" text="购物车" @click="toView(2)" />
        <van-goods-action-icon
          :icon="isCollect ? 'star' : 'star-o'"
          :text="isCollect ? '已收藏' : '收藏'"
          color="#ff5000"
          @click="isCollect ? deleteCollect() : addCollect()"
        />
        <van-goods-action-button type="warning" text="加入购物车" />
        <van-goods-action-button type="danger" text="立即购买" />
      </van-goods-action>
    </div>

    <!-- 网络错误 -->
    <van-empty
      class="error"
      v-show="isError"
      image-size="3rem"
      image="network"
      description="网络错误，请稍后再试！"
    >
      <button class="v-btn" @click="getGoodDetail">刷新</button>
    </van-empty>
  </div>
</template>

<script>
import { getGoodDetailById } from "@/api/good/good";
import { getGoodPropsById } from "@/api/good/props";
import {
  getTheCollectByGid,
  addCollectByGid,
  deleteCollectByGid,
} from "@/api/user/collect";
import { getResourImageByName } from "@/api/res";
import ShareNav from "@/components/Detail/ShareNav.vue";
import { Dialog, Toast } from "vant";
export default {
  components: { ShareNav },
  name: "GoodsDetail",
  data() {
    return {
      isError: false, // 网络错误
      isLoginState: this.$store.state.isLoginState,
      TOKEN: this.$store.state.token,
      GOOD_ID: this.$route.query?.id || "",
      item: {}, // 商品信息
      props: {}, //商品规格
      current: 0, // 图片
      isCollect: false, // 是否收藏
    };
  },

  created() {
    this.getGoodDetail(); // 获取商品详情
    this.getGoodProps(); // 获取商品规格
    this.getTheCollect(); // 获取是否收藏
  },

  methods: {
    // 获取商品详情
    getGoodDetail() {
      // 获取路由的信息
      if (this.GOOD_ID === "") return (this.isError = true);
      getGoodDetailById(this.GOOD_ID)
        .then((res) => {
          this.isError = !res.data.success;
          if (res.data.success) {
            this.item = res.data.data;
          }
        })
        .catch(() => {
          this.isError = true;
        });
    },

    // 获取商品规格
    getGoodProps() {
      // 获取路由的信息
      if (this.GOOD_ID === "") return (this.isError = true);
      getGoodPropsById(this.GOOD_ID)
        .then((res) => {
          this.isError = !res.data.success;
          if (res.data.success) {
            console.log(res.data.data);
            this.props = res.data.data;
          }
        })
        .catch(() => {
          this.isError = true;
        });
    },

    //

    // 获取本商品是否收藏
    getTheCollect() {
      if (this.GOOD_ID === "") return (this.isError = true);
      getTheCollectByGid(this.GOOD_ID, this.TOKEN)
        .then((res) => {
          this.isCollect = res.data.success;
        })
        .catch(() => {
          this.isError = true;
        });
    },
    // 添加本商品收藏
    addCollect() {
      addCollectByGid(this.GOOD_ID, this.TOKEN)
        .then((res) => {
          this.isCollect = res.data.success;
          res.data.success ? Toast(" 收藏成功！") : Toast(" 收藏失败！");
        })
        .catch(() => {});
    },

    // 删除本商品收藏
    deleteCollect() {
      Dialog.confirm({ title: "是否取消收藏？" })
        .then(() => {
          deleteCollectByGid(this.GOOD_ID, this.TOKEN)
            .then((res) => {
              if (res.data.success) {
                this.isCollect = false;
                Toast(" 取消成功！");
              } else {
                Toast(" 取消失败！");
              }
            })
            .catch(() => {
              Toast(" 取消失败！");
            });
        })
        .catch(() => {});
    },

    // 获取评论
    getCommentList() {},

    // 页面跳转
    toView(i) {
      switch (i) {
        // 前往搜索页面
        case 1:
          this.$router.push({
            name: "search",
            params: { animate: "forward" },
          });
          break;
        // 购物车页面
        case 2:
          this.$router.push({
            name: "shopcar",
            params: { animate: "forward" },
          });
          break;
      }
    },

    // 获取图片地址
    getImgSrc(url) {
      return getResourImageByName(url);
    },
  },
};
</script>


<style scoped>
.goods-detail {
  display: flex;
  flex-direction: column;
  padding: 0;
  padding-bottom: 1.2rem;
}
/* 轮播商品图 */
.custom-indicator {
  position: absolute;
  right: 0.4rem;
  bottom: 0.6rem;
  padding: 0.1rem 0.24rem;
  letter-spacing: 0.1em;
  font-size: 0.4rem;
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(128, 128, 128, 0.4);
  backdrop-filter: blur(20px);
  border-radius: 0.8rem;
}
.imags {
  width: 100%;
  height: 10rem;
  object-fit: contain;
  border-radius: 8px;
  overflow: hidden;
}
/* 主内容 */
.content {
  margin-top: -0.4rem;
  border-radius: 10px;
  padding: 0.3rem;
  background-color: var(--theme-color);
  z-index: 1;
}
.v-card {
  padding: 0.2rem 0.3rem;
  background-color: var(--theme-color3);
  margin-bottom: 0.3rem;
}
.top .price {
  font-size: 0.4rem;
  color: var(--tip-color2);
  padding: 0.2rem 0;
}
.price .big {
  padding-left: 0.1rem;
  font-size: 0.7rem;
}
.top .title {
  font-weight: 600;
  font-size: 0.45rem;
}
.lable {
  color: var(--text-color3);
  font-size: 0.36rem;
}
.lable-group {
  padding: 0.2rem 0;
  display: flex;
  justify-content: space-between;
}
/* 规格 */
.content .center {
}

body >>> .van-goods-action {
  z-index: 99;
  height: 1.6rem;
}
.van-goods-action .van-goods-action-icon {
  width: 0.5rem;
  height: 0.5rem;
}
</style>
