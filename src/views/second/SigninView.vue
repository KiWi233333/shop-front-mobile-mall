<template>
  <default-page title="签到" class="signin-view">
    <div v-show="show">
      <van-calendar
        :poppable="false"
        :show-confirm="false"
        :show-title="true"
        :confirm-text="signInText"
        :readonly="true"
        :color="isSignin ? '#f621097c' : 'var(--tip-color2)'"
        row-height="1.6rem"
        class="v-card calender"
      >
        <template #title>
          <div class="title">
            {{ isSignin ? "今天已签过了~" : "你今天还未签到~" }}
          </div>
        </template>
        <template #footer>
          <div class="bottom">
            <van-button
              @click="addSignin"
              class="v-btn"
              :text="signInText"
              :disabled="isSignin"
            />
            <span class="top" v-show="siginDays">
              总计&nbsp;{{ siginDays }}&nbsp;天
            </span>
          </div>
        </template>
      </van-calendar>
    </div>
  </default-page>
</template>

<script>
import DefaultPage from "@/components/DefaultPage.vue";
import { getSignDays, isTodaySignIn, setUserSignIn } from "@/api/user/signin";
import { Toast } from "vant";
export default {
  components: { DefaultPage },
  name: "SigninView",
  data() {
    return {
      siginDays: 0,
      signInText: "签到",
      isSignin: false,
      show: false,
    };
  },
  mounted() {
    // 是否签到
    isTodaySignIn(this.$store.getters.token)
      .then((res) => {
        this.show = true;
        this.isSignin = res.data.success;
      })
      .catch();
    // 签到天数
    this.getAllSigninDays();
  },
  watch: {
    isSignin(v) {
      this.signInText = v ? "已签到" : "签到";
    },
  },
  methods: {
    // 获取签到天数
    getAllSigninDays() {
      // 签到总天数
      getSignDays(this.$store.getters.token)
        .then((res) => {
          if (res.data.success) {
            this.siginDays = res.data.data;
          }
        })
        .catch();
    },

    // 签到
    async addSignin() {
      const res = await setUserSignIn(this.$store.getters.token);
      if (res.status === 200 && res.data.success) {
        this.isSignin = true;
        // 签到天数
        this.getAllSigninDays();
        Toast({ type: "success", message: "签到成功！" });
      } else {
        this.isSignin = false;
        Toast({ type: "fail", message: "签到失败，请稍后再试！" });
      }
    },
  },
};
</script>

<style scoped>
.signin-view .v-card {
  border-radius: 10px;
  box-shadow: var(--shadow-color);
}
.signin-view .title {
  margin-bottom: 0.4rem;
  text-align: center;
}
.calender {
  text-align: center;
  height: 11rem;
  box-shadow: var(--shadow-color);
  margin-top: 0.5rem;
}
.calender .title {
  padding: 0.1rem;
  font-weight: 600;
}
.calender .v-btn {
  background-color: var(--tip-color2);
  box-shadow: 1px 2px 4px #da1f0a92;
  color: var(--theme-color);
  height: 0.8rem;
  padding: 0 0.5rem;
}
.calender >>> .van-calendar__confirm::before,
.calender >>> .van-button__content {
  width: 100%;
  background-color: var(--tip-color2);
  padding: 0.2rem;
  transition: 0.2s;
}
.calender >>> .van-calendar__header {
  border-radius: 10px;
  box-shadow: var(--shadow-color3);
  font-size: 0.4rem;
}
.calender .bottom {
  padding-top: 0.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--border-color);
}
.calender .top {
  padding: 0.1rem;
  font-size: 0.3rem;
}
</style>