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
            ￥
            <span class="big">{{ getPrice(item?.price) || "0.00" }}</span>
            <span class="small"
              >原价:￥{{ getPrice(item?.price) || "0.00" }}</span
            >
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
              已选：<span class="box" ref="selectOption">{{ getOption }}</span>
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
              <span class="lable">配送至：{{ "市" }}</span>
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
          @click="comments.length ? toView(5) : ''"
          class="v-card comments animate__animated animate__fadeIn"
        >
          <div class="lable-group">
            商品评价 ({{ comments.length }})
            <div
              class="lable"
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
            v-if="comments.length"
            :disable-comment="true"
          />
        </div>
      </div>
      <!-- 评论弹窗 -->
      <!-- <comment-popup /> -->

      <!-- 商品详情 -->
      <div class="detail-info">
        <div class="title">————<span>&emsp;宝贝详情&emsp;</span>————</div>
        <div class="label label1">{{ getSafeInfo }}</div>
        <van-image
          lazy-load
          :src="getImgSrc(item?.goods?.images)"
          class="img"
        />
      </div>

      <!-- 规格详情选择 -->
      <van-sku
        ref="skucart"
        v-model="showProps"
        :sku="initSku"
        :goods="{ picture: getImgSrc(goodProps?.defaultOption?.icon) }"
        :goods-id="GOOD_ID"
        :initial-sku="skuDefault"
        :quota="0"
        :stock-threshold="10"
        @sku-selected="selectedSku"
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
            @click="showProps = true"
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
// res
import { getGoodDetailById } from "@/api/good/good";
import { getGoodProps, getGoodPropsById } from "@/api/good/props";
import {
  getTheCollectByGid,
  addCollectByGid,
  deleteCollectByGid,
} from "@/api/user/collect";
import { getResourImageByName } from "@/api/res";
import { getGoodCommentById } from "@/api/comment/comment";
import { addShopCart } from "@/api/shopcart/shopcart";
// components
import ShareNav from "@/components/Detail/ShareNav.vue";
import { Dialog, Toast } from "vant";
import { mapState } from "vuex";
import CommentCard from "@/components/Comment/CommentCard.vue";
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

      // 内属性
      showProps: false,
      allStock: "", // 总库存

      combos: [],
      sizes: [],
      colors: [],
      editions: [],
      rows: [],

      initSku: {},
      skuDefault: {}, // 默认选项
      finalSelectVal: {}, // 最终选项
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
    // sku属性选择变化
    finalSelectVal() {
      this.$refs.selectOption.innerHTML = this.finalSelectVal;
    },
  },

  methods: {
    // 获取商品详情
    getGoodDetail() {
      // 获取路由的信息
      if (this.GOOD_ID === "") return (this.isError = true);
      getGoodDetailById(this.GOOD_ID)
        .then((res) => {
          this.isError = !res.data.code === 20011;
          if (res.data.code === 20011) {
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
      if (res.status === 200 && res.data.code === 20011) {
        this.goodProps = res.data.data;
        // 初始化属性组合
        this.initProps();
      } else {
        this.isError = true;
      }
    },

    // 属性变化触发
    selectedSku(info) {
      const { selectedSkuComb } = info;
      if (!selectedSkuComb) return;
      this.finalSelectVal = selectedSkuComb.props;
    },

    // 提交订单
    toMakeOder({ selectedSkuComb, selectedNum }) {
      selectedSkuComb.price = selectedSkuComb.price / 100;
      this.$router.push({
        name: "checkorder",
        params: {
          animate: "forward",
          toBack: "true",
        },
        query: {
          // 传参
          info: {
            price: selectedNum * selectedSkuComb.price, // 最终价格
          },
          goodsList: [
            {
              ...this.item.goods,
              id: selectedSkuComb.id, // 选中商品id
              gid: this.item.goods.id,
              props: selectedSkuComb.props, // 选择属性
              quantity: selectedNum, // 数量
              price: selectedSkuComb.price, // 价格
              unitPrice: selectedSkuComb.price, //
              postage: this.item.goods.postage,
            },
          ],
        },
      });
    },

    // 添加购物车
    async addShopCar(info) {
      if (!this.$store.getters.token) return Toast("您还未登录！");
      const res = await addShopCart(
        info.selectedSkuComb.id,
        info.selectedNum,
        this.$store.getters.token
      );
      // console.log(res.data);
      if (res.status === 200 && res.data.code === 20011) {
        Toast("加购成功！");
      } else {
        Toast("加购失败，稍后再试！");
      }
      this.showProps = false;
    },

    // 初始化属性组合
    initProps() {
      const { defaultOption, combo, colorAndIcon, size, edition } =
        this.goodProps;

      const price = Number(defaultOption.price).toFixed(2);
      const props = {
        tree: [], // 类组row
        list: [], // 全部组合col

        price, // 默认价格（单位元）
        stock_num: 0,
        listIndex: "", // 库存不为0的坐标
        hide_stock: false, // 是否隐藏剩余库存
      };

      // 套装
      let row = 0;
      if (combo.length > 0) {
        row++;
        let row1 = {
          k: "套装",
          k_s: "combo",
          v: [],
          largeImageMode: false, //  是否展示大图模式
        };
        // 套装子属性
        combo.forEach((p, i) => {
          row1.v.push({
            id: i,
            name: p.combo,
          });
          this.combos.push(p.combo);
        });
        this.rows.push("combo");
        props.tree.push(row1);
      }

      // 颜色
      if (colorAndIcon.length > 0) {
        row++;
        let row2 = {
          k: "颜色", // 属性类别
          k_s: "color",
          v: [], // 子属下
        };
        colorAndIcon.forEach((p, i) => {
          row2.v.push({
            id: i,
            name: p.color,
            imgUrl: p.icon ? this.getImgSrc(p.icon) : "",
            previewImgUrl: p.icon ? this.getImgSrc(p.icon) : "",
          });
          this.colors.push(p.color);
        });
        this.rows.push("color");
        props.tree.push(row2);
      }

      // 规格
      if (size.length > 0) {
        row++;
        let row3 = {
          k: "规格", // 属性类别
          k_s: "size",
          v: [], // 子属性
        };
        size.forEach((p, i) => {
          row3.v.push({
            id: i,
            isSellOut: p.isSellOut !== "",
            // name: p.size + ` ${p.isSellOut || ""}`,
            name: p.size,
          });
          this.sizes.push(p.size);
        });
        this.rows.push("size");
        props.tree.push(row3);
      }

      // 版本
      if (edition.length > 0) {
        row++;
        row;
        let row4 = {
          k: "版本", // 属性类别
          // k_s: `row${row}`,
          k_s: "edition",
          v: [], // 子属下
        };
        edition.forEach((p, i) => {
          row4.v.push({
            id: i,
            name: p.edition,
            imgUrl: this.getImgSrc(p.icon),
            previewImgUrl: this.getImgSrc(p.icon),
          });
          this.editions.push(p.edition);
        });
        this.rows.push("edition");
        props.tree.push(row4);
      }
      // const _this = this; // vue
      // 内部属性
      const GOOD_ID = this.goodProps.defaultOption.gid;
      const rows = this.rows;
      const goodsPropsList = {
        color: this.colors,
        size: this.sizes,
        combo: this.combos,
        edition: this.editions,
      };

      // 主函数
      function getList(tree, _this) {
        let res = [];
        let group = 1; // 组数
        for (let i = 0; i < tree.length; i++) {
          group = tree[i].v ? group * tree[i].v.length : group;
        }
        const item = {
          selectedNum: 0,
        }; // 产品规格
        let indexCol = 0;
        let allStock = 0;

        // 回调
        callBack(tree, item, indexCol, allStock, rows);

        // 递归
        async function callBack(tree, item, indexCol, allStock, rows) {
          for (let i = 0; i < tree[indexCol].v.length; i++) {
            // row-value
            item = JSON.parse(JSON.stringify(item));
            item[rows[indexCol]] = i;
            if (res.find((p) => item.id === p.id)) continue;
            // 下一行 (递归次数)
            if (indexCol + 1 === tree.length) {
              // 初始化obj
              const obj = {};
              for (let k = 0; k < rows.length; k++) {
                obj[rows[k]] = "";
              }
              for (const key in obj) {
                obj[key] = goodsPropsList[key][item[key]];
                item.props = (item?.props || "") + `${obj[key]} `;
              }

              // 网络请求添加不同组合的id
              const { color, combo, size, edition } = obj;
              const http = await getGoodProps(
                GOOD_ID,
                color,
                combo,
                size,
                edition
              );
              if (http.status === 200 && http.data.data) {
                const p = http.data.data.defaultOption;
                item.id = String(p.id);
                item.price = p.price * 100;
                item.stock_num = +p.stock;
                item.gid = String(p.gid);
                item.icon = p.icon;
                if (item.stock_num > 0 && props.listIndex === "") {
                  props.listIndex = res.length; // 记录默认值的位置
                  _this.skuDefault = JSON.parse(JSON.stringify(item));
                }
                props.stock_num = props.stock_num + item.stock_num;

                res.push(JSON.parse(JSON.stringify(item)));
                item.id = "";
                item.props = "";
              }
              continue; // 继续
            }
            // 下一行
            indexCol++;
            await callBack(tree, item, indexCol, allStock, rows); // 最后一排
          }
        }
        return res;
      }
      // console.log(props);

      // 赋值
      props.list = getList(props.tree, this);
      this.initSku = props;
      // this.$nextTick(() => {
      //   this.skuDefault = props[props.listIndex];
      // });
    },

    // 获取本商品是否收藏
    getTheCollect() {
      if (this.GOOD_ID === "") return (this.isError = true);
      getTheCollectByGid(this.GOOD_ID, this.$store.getters.token)
        .then((res) => {
          this.isCollect = res.data.code === 20011;
        })
        .catch(() => {
          this.isError = true;
        });
    },
    // 添加本商品收藏
    addCollect() {
      // 拦截
      if (!this.isLoginState) return this.toView(4);
      addCollectByGid(this.GOOD_ID, this.$store.getters.token)
        .then((res) => {
          this.isCollect = true;
          res.data.code === 20011 ? Toast(" 收藏成功！") : Toast(" 收藏失败！");
        })
        .catch(() => {});
    },
    // 删除本商品收藏
    deleteCollect() {
      // 拦截
      if (!this.isLoginState) return this.toView(4);

      Dialog.confirm({ title: "是否取消收藏？" })
        .then(() => {
          deleteCollectByGid(this.GOOD_ID, this.$store.getters.token)
            .then((res) => {
              if (res.data.code === 20011) {
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
    getCommentList() {
      getGoodCommentById(this.GOOD_ID, 0, this.$store.getters.token)
        .then((res) => {
          if (res.data.code === 20011) {
            const data = res.data.data;
            data.forEach((p) => {
              this.comments.push(p);
            });
          }
        })
        .catch(() => {});
    },

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
            name: "order",
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
        // 评论列表页面
        case 5:
          this.$router.push({
            name: "comment",
            query: { id: this.GOOD_ID, size: this.comments.length },
            params: { animate: "forward" },
          });
          break;
        // 评论详情页面
        case 6:
          this.$router.push({
            name: "commentdetail",
            query: { id: this.GOOD_ID },
            params: { animate: "forward" },
          });
          break;
      }
    },

    // 获取价格
    getPrice(price) {
      return ((price * 1000 * this.item.discount) / 1000).toFixed(2);
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
  margin-top: -0.42rem;
  border-radius: 10px;
  padding: 0.25rem;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
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
  font-family: Helvetica;
}
.price .big {
  font-size: 0.7rem;
}
.price .small {
  color: var(--text-color3);
  font-size: 0.3rem;
  padding-left: 0.1rem;
  text-decoration: line-through;
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

/* 商品详情 */
.detail-info {
  width: 100%;
}
.detail-info .title {
  text-align: center;

  padding: 0 0.4rem;
  margin-bottom: 0.3rem;
  color: var(--border-color);
}
.detail-info .title span {
  color: var(--text-color4);
}
.detail-info .label {
  padding: 0.2rem;
}
.detail-info .label1 {
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-color3);
  margin-bottom: 0.5rem;
}
.detail-info .img {
  width: 100%;
}
</style>
