<template>
  <div class="purse-view" v-show="!isError">
    <top-nav :title="'我的钱包'" @click-left="$router.back()" />
    <!-- 主内容 -->
    <main v-if="!isError">
      <!-- 钱包卡片 -->
      <div class="v-card top-card animate__animated animate__fadeInUp">
        <div class="left">
          <label>余额</label>
          <label @click="reqPurseInfo" class="btm">
            <span class="tp">￥</span>
            <span class="big" v-show="!isLodaing">{{
              Number(this.purseInfo?.balance).toFixed(2) || "0.00"
            }}</span>
            <van-loading
              class="load"
              v-show="isLodaing"
              color="var(--text-color)"
              size="0.6rem"
            />
          </label>
        </div>
        <div class="right">
          <img src="@/assets/image/icon/balance_icon.png" class="bg" />
        </div>
      </div>
      <!-- 底部 -->
      <div class="bottoms">
        <!-- 标题 -->
        <div class="center-title">
          <label>充值套餐</label>
          <span>（单位:￥）</span>
        </div>
        <!-- 底部套餐 -->
        <div class="combo">
          <div
            @click="toReCharge(p.id, p.price, p.points)"
            class="v-click v-card item"
            v-for="p in chargeCombo"
            :key="p.id"
          >
            <div class="price">{{ p?.price }}</div>
            <div class="active">
              送
              <span style="color: var(--tip-color)">{{ p?.points }}</span>
              积分
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- 网络错误 -->
    <error-card
      v-if="isError"
      @refresh="window.reload()"
      :image="'network'"
      text="网络错误，请稍后再试！"
    />
    <div class="btm-text">——————&emsp;理性消费，共建共享&emsp;——————</div>
  </div>
</template>
<script>
import { getPurseInfo } from "@/api/user/purse";
import { getRechargeCombo, reCharge } from "@/api/user/purse";
import TopNav from "@/components/TopNav.vue";
import ErrorCard from "@/components/ErrorCard.vue";
import { Dialog, Notify } from "vant";
import { mapState } from "vuex";
export default {
  components: { TopNav, ErrorCard },
  name: "PurseView",
  data() {
    return {
      chargeCombo: [], // 充值套餐
      isLodaing: true, // 加载
      isError: false, // 404
      timer: "",
    };
  },
  computed: { ...mapState(["purseInfo"]) },
  mounted() {
    // 获取钱包余额
    this.reqPurseInfo();
    // 获取充值套餐
    this.getCombo();
  },
  methods: {
    // 请求钱包信息
    reqPurseInfo() {
      if (this.timer !== "") return;
      this.isLodaing = true;
      this.timer = setTimeout(async () => {
        const res = await getPurseInfo(this.$store.getters.token);
        if (res.status == 200 && res.data.success) {
          this.$store.commit("setPurseInfo", res.data.data);
          this.timer = "";
          this.isLodaing = false;
          return;
        }
        this.isError = true;
      }, 800);
    },
    // 获取套餐
    async getCombo() {
      const res = await getRechargeCombo(this.$store.getters.token);
      if (res.status === 200 && res.data.success) {
        this.chargeCombo = res.data.data;
        return;
      }
      this.isError = true;
    },

    // 充值对应的金额
    toReCharge(id, price, points) {
      Dialog.confirm({
        title: "是否充值？",
        message: `您将充值${price}元,赠送${points}积分`,
        beforeClose: (action, done) => {
          if (action === "confirm") {
            setTimeout(async () => {
              // 请求
              const res = await reCharge(this.$store.getters.token, id, price);
              if (res.status === 200 && res.data.success) {
                Notify({ message: "充值成功！", type: "success" });
                this.reqPurseInfo(); // 重新获取
              } else {
                Notify({ message: "充值失败！", type: "danger" });
              }
              done(); // 完成
            }, 1500);
          } else {
            done(); // 完成
          }
        },
      }).catch(() => {});
    },
  },
};
</script>
  
<style scoped>
.purse-view {
  padding: 0.2rem 0;
  overflow: hidden;
  user-select: none;
}
/* 顶部卡片 */
.top-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.8rem;
  font-weight: 600;
  color: var(--text-color);
  background-color: var(--theme-color2);
  margin: 0.4rem 0.3rem;
  margin-bottom: 0;
  transition: 0.4s;
  height: 3.8rem;
  border-radius: 10px 10px 0 0;
}
.top-card .left {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  transition: 0.4s;
}
.top-card .left label {
  padding: 0.1rem 0;
  display: inline-block;
}
.top-card .left .btm {
  height: 1rem;
  display: flex;
  align-items: flex-end;
}
.top-card .left .big {
  margin-bottom: -0.2rem;
}
.top-card .load {
  display: inline-block;
}
.top-card .left .big {
  font-size: 0.9rem;
  font-family: sans-serif;
  cursor: pointer;
}
.top-card .right img {
  display: block;
  width: 2rem;
  object-fit: contain;
}

/* 底部套餐 */
.bottoms {
  margin-top: -0.4rem;
  position: relative;
  box-shadow: rgba(128, 128, 128, 0.3) 0 -2px 4px;
  border-radius: 10px 10px 0 0;
  padding: 0.3rem 0.2rem;
  background-color: var(--theme-color);
}
.combo {
  display: grid;
  justify-content: space-around;
  grid-template-columns: repeat(3, 3.2rem);
}
.combo .item {
  padding: 0.2rem 0.2rem;
  border: 1px solid var(--border-color);
  background-color: var(--theme-color);
  border-radius: 8px;
  margin: 0.2rem;
  text-align: center;
  cursor: pointer;
}
.item .price {
  font-weight: 600;
  font-size: 0.5rem;
  color: var(--theme-color4);
  padding-bottom: 0.1rem;
}
.item .active {
  font-size: 0.1rem;
  color: var(--text-color3);
}
.btm-text {
  width: 100%;
  text-align: center;
  color: var(--text-color3);
  opacity: 0.6;
  font-size: 0.2rem;
}
.center-title {
  width: 100%;
  padding: 0.2rem;
}
.center-title span {
  font-size: 0.32rem;
}
</style>