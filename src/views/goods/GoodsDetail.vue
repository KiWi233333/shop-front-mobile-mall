<template>
  <div class="wind-init goods-detail">
    <!-- 顶部导航 -->
    <share-nav />
    <div class="contents" v-if="!isError">
      <!-- 商品图片 -->
      <van-swipe>
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
      <div class="content">
        <!-- 标题 -->
        <div class="v-card top">
          <div class="price">
            ￥<span class="big">{{ item?.price || "0.00" }}</span>
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
          <div class="lable-group" @click="showProps = true">
            <span class="lable">选择</span>
            <div class="lable black props">
              已选：<span class="box">{{ getOption }}</span>
            </div>
            <van-icon name="arrow" />
          </div>
          <!-- 发货 -->
          <div class="lable-group">
            <span class="lable">发货</span>
            <div class="flex-col w-80">
              <span class="lable black" style="padding-bottom: 0.2rem"
                >{{ item?.goods?.city }} | 快递：{{
                  item?.goods?.postage ? `${item.goods.postage} 元` : "免运费"
                }}</span
              >
              <span class="lable">配送至：{{ "请登陆，获取地址" }}</span>
            </div>
            <van-icon name="arrow" />
          </div>
          <!-- 保障 -->
          <div class="lable-group">
            <span class="lable">保障</span>
            <div class="flex-col w-80">
              <span class="box">{{ getSafeInfo }}</span>
            </div>
            <van-icon name="arrow" />
          </div>
        </div>
        <!-- 评论 -->
        <div
          class="v-card comments animate__animated animate__fadeIn"
          v-show="comments.length"
        >
          <div class="lable-group">
            商品评价 ({{ comments.length }})
            <div
              class="lable"
              @click="toView(5)"
              style="color: var(--tip-color2); font-size: 0.3rem"
            >
              更多<van-icon
                name="arrow"
                color="var(--tip-color2)"
                class="icon"
              />
            </div>
          </div>
          <!-- 单条评论 -->
          <comment-card
            :comment="comments[0]"
            v-show="comments.length"
            @setIsLike="changeCommentLike"
          />
        </div>
      </div>

      <!-- 规格详情选择 -->
      <van-sku
        v-if="isSku"
        v-model="showProps"
        :sku="initSku"
        :goods="item"
        :goods-id="GOOD_ID"
        :initial-sku="skuDefault"
        :hide-stock="initSku.hide_stock"
        :quota="0"
        :stock-threshold="10"
        @buy-clicked="toMakeOder"
        @add-cart="addShopCar"
        stepper-title="购买数量"
      />
      <!-- 底部导航 -->
      <div class="shop-nav" v-if="!isError">
        <van-goods-action>
          <van-goods-action-icon icon="chat-o" text="客服" color="#ee0a24" />
          <van-goods-action-icon
            icon="cart-o"
            text="购物车"
            @click="toView(2)"
          />
          <van-goods-action-icon
            :icon="isCollect ? 'star' : 'star-o'"
            :text="isCollect ? '已收藏' : '收藏'"
            color="#ff5000"
            @click="isCollect ? deleteCollect() : addCollect()"
          />
          <van-goods-action-button
            type="warning"
            text="加入购物车"
            @click="addShopCar"
          />
          <van-goods-action-button
            type="danger"
            text="立即购买"
            @click="showProps = true"
          />
        </van-goods-action>
      </div>
    </div>
    <!-- 网络错误 -->
    <error-card
      v-if="isError"
      @refresh="getGoodDetail"
      :image="'network'"
      text="网络错误，请稍后再试！"
    />
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
import { getGoodCommentById } from "@/api/comment/comment";
import ShareNav from "@/components/Detail/ShareNav.vue";
import { Dialog, Toast } from "vant";
import { mapState } from "vuex";
import CommentCard from "@/components/Detail/CommentCard.vue";
import ErrorCard from "@/components/ErrorCard.vue";
export default {
  components: { ShareNav, CommentCard, ErrorCard },
  name: "GoodsDetail",
  data() {
    return {
      isError: false, // 网络错误
      GOOD_ID: this.$route.query?.id || "",

      // 商品信息
      item: {}, // 商品信息
      goodProps: {}, //商品规格
      newOption: {}, // 选择规格

      // 评论
      current: 0, // 图片
      isCollect: false, // 是否收藏
      comments: [], // 评论集合

      // 属性
      showProps: false,
      isSku: false, // 用于刷新
      // isStock: false, // 是否有库存
      initSku: {},
      skuDefault: {},
    };
  },
  mounted() {
    this.getGoodDetail(); // 获取商品详情
    this.getGoodProps(); // 获取商品规格
  },
  watch: {
    // 需token请求的
    token: {
      immediate: true,
      deep: true,
      handler() {
        this.getCommentList(); // 获取评论
        this.getTheCollect(); // 获取是否收藏
      },
    },
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
    async getGoodProps() {
      // 获取路由的信息
      if (this.GOOD_ID === "") return (this.isError = true);
      const res = await getGoodPropsById(this.GOOD_ID);
      if (res.status === 200 && res.data.success) {
        console.log(res.data.data);
        this.goodProps = res.data.data;
        // 初始化属性组合
        this.initProps();
      } else {
        this.isError = true;
      }
    },

    // 提交订单
    toMakeOder() {},

    // 初始化属性组合
    initProps() {
      const { defaultOption, combo, colorAndIcon, size, edition } =
        this.goodProps;

      const price = Number(defaultOption.price).toFixed(2);

      const props = {
        tree: [], // 类组row
        list: [], // 全部组合col

        price, // 默认价格（单位元）
        stock_num: +defaultOption.stock, // 商品总库存

        hide_stock: false, // 是否隐藏剩余库存
      };

      // 套装
      if (combo.length > 0) {
        let row1 = {
          k: "套装",
          k_s: "row1",
          v: [],
          largeImageMode: false, //  是否展示大图模式
        };
        // 套装子属性
        combo.forEach((p, i) => {
          row1.v.push({
            id: i,
            name: p.combo,
          });
        });
        props.tree.push(row1);
      }

      // 颜色
      if (colorAndIcon.length > 0) {
        let row2 = {
          k: "颜色", // 属性类别
          k_s: "row2", // key名
          v: [], // 子属下
        };
        colorAndIcon.forEach((p, i) => {
          row2.v.push({
            id: i,
            name: p.color,
            imgUrl: p.icon ? this.getImgSrc(p.icon) : "",
            previewImgUrl: p.icon ? this.getImgSrc(p.icon) : "",
          });
        });
        props.tree.push(row2);
      }

      // 规格
      if (size.length > 0) {
        let row3 = {
          k: "规格", // 属性类别
          k_s: "row3", // key名
          v: [], // 子属性
        };
        size.forEach((p, i) => {
          row3.v.push({
            id: i,
            name: p.size + ` ${p.isSellOut || ""}`,
          });
        });
        props.tree.push(row3);
      }

      // 版本
      if (edition.length > 0) {
        let row4 = {
          k: "版本", // 属性类别
          k_s: "row4", // key名
          v: [], // 子属下
        };
        colorAndIcon.forEach((p, i) => {
          row4.v.push({
            id: i,
            name: p.color,
            imgUrl: this.getImgSrc(p.icon),
            previewImgUrl: this.getImgSrc(p.icon),
          });
        });
        props.tree.push(row4);
      }

      for (let i = 0; i < props.tree.length; i++) {
        for (let j = 0; j < props.tree[i].length; j++) {
          props.list.push({
            id: 2259,
            row1: `${i}`,
            row2: `${j}`,
            row3: `${j}`,
            row4: `${j}`,
            price,
            stock_num: 110,
          });
        }
      }
      console.log(props);
      this.defaultOption = {
        row1: "1",
        row2: "1",
        row3: "1",
        row4: "1",
        // 初始选中数量
        selectedNum: 1,
      };
      this.isSku = true;
      this.initSku = props;
    },
    // 获取本商品是否收藏
    getTheCollect() {
      if (this.GOOD_ID === "") return (this.isError = true);
      getTheCollectByGid(this.GOOD_ID, this.token)
        .then((res) => {
          this.isCollect = res.data.success;
        })
        .catch(() => {
          this.isError = true;
        });
    },
    // 添加本商品收藏
    addCollect() {
      // 拦截
      if (!this.isLoginState) return this.toView(4);

      addCollectByGid(this.GOOD_ID, this.token)
        .then((res) => {
          this.isCollect = res.data.success;
          res.data.success ? Toast(" 收藏成功！") : Toast(" 收藏失败！");
        })
        .catch(() => {});
    },
    // 删除本商品收藏
    deleteCollect() {
      // 拦截
      if (!this.isLoginState) return this.toView(4);

      Dialog.confirm({ title: "是否取消收藏？" })
        .then(() => {
          deleteCollectByGid(this.GOOD_ID, this.token)
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
    // 修改评论点赞和喜欢
    changeCommentLike(i) {
      let liked = this.comments[0].liked;
      // 喜欢状态
      this.$set(this.comments[0], "isLiked", i);
      // 点赞数
      i ? liked++ : liked--;
      this.$set(this.comments[0], "liked", liked);
    },

    // 获取评论
    getCommentList() {
      getGoodCommentById(this.token, this.GOOD_ID, 0)
        .then((res) => {
          if (res.data.success) {
            console.log(res.data.data);
            const data = res.data.data;
            data.forEach((p) => {
              this.comments.push(p);
            });
          }
        })
        .catch(() => {});
    },

    // 添加购物车
    addShopCar() {},

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
        // 提交订单页面
        case 3:
          this.$router.push({
            name: "payorder",
            params: { animate: "forward" },
          });
          break;
        // 登录页面
        case 4:
          this.$router.push({
            name: "login",
            params: { animate: "forward" },
          });
          break;
        // 登录页面
        case 5:
          this.$router.push({
            name: "comment",
            query: { id: this.GOOD_ID },
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

  computed: {
    ...mapState(["token", "isLoginState"]),

    // 获取默认属性规格
    getOption() {
      if (this.goodProps?.defaultOption) {
        const p = this.goodProps?.defaultOption;
        return `${p?.color ?? ""}  ${p?.size ?? ""}  ${p?.combo ?? ""} `;
      }
      return "";
    },

    // 获取保障信息
    getSafeInfo() {
      const p = this.item?.goods;
      if (!p) return "";
      let res = [];
      if (p?.warrantyTime > 0) res.push(` 保障：${p.warrantyTime}天`);
      if (p.changerTime > 0) res.push(` 包退：${p.changerTime}天`);
      if (p.refundTime > 0) res.push(` 包换：${p.refundTime}天`);
      return res.toString();
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
  /* background-color: var(--theme-color); */
  background-color: white;
  z-index: 1;
}
.v-card {
  padding: 0.2rem 0.3rem;
  background-color: var(--theme-color3);
  margin: 0.15rem 0;
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
.shop-nav {
  z-index: 999;
}
/* 规格组 */
.lable-group {
  padding: 0.2rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lable-group .lable {
  color: var(--text-color3);
  font-size: 0.32rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.lable-group .black {
  color: var(--text-color4);
}
/* 暗色规格 */
.lable-group .props {
  width: 80%;
}
.lable-group .box {
  cursor: pointer;
  display: inline-block;
  max-width: calc(100% - 4em);
  color: var(--text-color3);
  background-color: var(--bg-color5);
  border-radius: 0.4em;
  padding: 0.08rem 0.15rem;
  font-size: 0.25rem;
  text-overflow: clip;
  white-space: nowrap;
  overflow: hidden;
}
/* 评论框 */
.comments {
  position: relative;
}
</style>
