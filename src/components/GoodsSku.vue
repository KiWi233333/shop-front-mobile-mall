<template >
  <!-- 规格详情选择 -->
  <van-sku
    v-model="show"
    ref="skucart"
    :sku="initSku"
    :goods="{ picture: getImgSrc(goodProps?.defaultOption?.icon) }"
    :goods-id="GOOD_ID"
    :initial-sku="skuDefault"
    :quota="99"
    :stock-threshold="10"
    :show-add-cart-btn="false"
    buy-text="确认修改"
    stepper-title="购买数量"
    @sku-selected="selectedSku"
    @buy-clicked="changeShorCartProps"
  />
</template>
<script>
import { getGoodProps, getGoodPropsById } from "@/api/good/props";
import { getResourImageByName } from "@/api/res";
import { mapState } from "vuex";
import { updateShopCartProps } from "@/api/shopcart/shopcart";
export default {
  props: {
    value: { required: true },
    GOOD_ID: { required: true },
    cartId: { required: false },
  },
  model: {
    prop: "value",
    event: "input",
  },
  data() {
    return {
      show: false,

      goodProps: {},

      // 内属性
      allStock: "", // 总库存
      selectProps: {}, // 选择的属性

      combos: [],
      sizes: [],
      colors: [],
      editions: [],
      rows: [],

      initSku: {},
      skuDefault: {}, // 默认选项
      selectPropsName: "", // 最终选项名称
    };
  },
  methods: {
    // 获取商品规格
    async getGoodProps() {
      this.initSku = {};
      this.combos = [];
      this.sizes = [];
      this.colors = [];
      this.editions = [];
      this.rows = [];
      this.skuDefault = {}; // 默认选项
      this.selectPropsName = ""; // 最终选项名称
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
      if (!info.selectedSkuComb) return;
      this.selectPropsName = info.selectedSkuComb.props;
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
        listIndex: 0, // 库存不为0的坐标
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
      // 内部属性
      const GOOD_ID = this.goodProps.defaultOption.gid;
      const rows = this.rows;
      const goodsPropsList = {
        color: this.colors,
        size: this.sizes,
        combo: this.combos,
        edition: this.editions,
      };
      props.list = getList(props.tree);

      // 主函数
      function getList(tree) {
        let res = [];
        let group = 1; // 组数
        for (let i = 0; i < tree.length; i++) {
          group = tree[i].v ? group * tree[i].v.length : group;
        }
        const item = {}; // 产品规格
        let indexCol = 0;
        let allStock = 0;
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
                props.stock_num = props.stock_num + item.stock_num;
                props.listIndex = res.push(JSON.parse(JSON.stringify(item)));
                item.id = "";
                item.props = "";
              }
              continue; // 继续
            }
            // 下一行
            indexCol++;
            callBack(tree, item, indexCol, allStock, rows); // 最后一排
          }
        }
        return res;
      }
      this.initSku = props;
      this.skuDefault = { ...props.list[0], selectedNum: 1 };
      // console.log(props.list);
    },

    // 修改规格
    async changeShorCartProps(info) {
      this.$toast.loading({ forbidClick: true, duration: 0 });

      // 修改属性
      const res = await updateShopCartProps(
        this.cartId,
        info.selectedSkuComb?.id,
        info?.selectedNum,
        this.$store.getters.token
      );
      if (res.status === 200 && res.data.code === 20011) {
        this.$emit("updataShopcart"); // 刷新
        this.$toast.clear();
        this.show = false;
        this.$toast.success("修改成功！");
      } else {
        this.$toast.fail("修改失败！");
      }
    },

    // 获取图片
    getImgSrc(url) {
      return getResourImageByName(url);
    },
  },
  computed: {
    // 解构
    ...mapState(["token", "isLoginState"]),

    // 获取默认属性规格
    getOption() {
      if (this.goodProps?.defaultOption) {
        const p = this.goodProps?.defaultOption;
        return `${p?.color ?? ""}  ${p?.size ?? ""}  ${p?.combo ?? ""} `;
      }
      return "";
    },
  },
  watch: {
    // v-model
    value(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("input", val);
    },

    // sku属性选择变化
    selectPropsName() {
      this.selectPropsName;
    },
    // 更新规格
    GOOD_ID: {
      immediate: true,
      handler() {
        this.getGoodProps();
      },
    },
  },
};
</script>
<style scoped>
</style>