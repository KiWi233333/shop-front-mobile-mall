<template>
  <div class="ChangePhone">
    <!-- 验证本人 -->
    <div class="first" v-if="!isUser">
      <span class="title">请查看 {{ getPhoneFormat }} 收到的验证码</span>
      <van-field
        v-model="oldCode"
        type="number"
        size="6"
        left-icon="label-o"
        placeholder=" 验证码"
        class="v-input code-input"
        :rules="[{ required: true }]"
      >
        <template #button>
          <!-- 获取验证码 -->
          <input
            type="button"
            class="right-btn"
            @click="getLoginCode"
            :disabled="codeFontDis"
            v-model="codeFont"
            :style="codeFontDis ? 'opacity:0.7;' : 'opacity:1;'"
        /></template>
      </van-field>
      <!-- 按钮 -->
      <div class="btn-group">
        <input
          @click="toLoginByReg"
          type="button"
          value="下一步"
          class="v-btn"
        />
      </div>
    </div>
    <!-- 修改手机号 -->
    <div class="second" v-if="isUser">
      <span class="title">请输入新的手机号并验证</span>
      <van-field
        v-model="newPhone"
        type="tel"
        size="11"
        left-icon="label-o"
        placeholder=" 输入新的手机号"
        class="v-input code-input"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="newCode"
        type="number"
        size="6"
        left-icon="label-o"
        placeholder=" 验证码"
        class="v-input code-input"
        :rules="[{ required: true }]"
      >
        <template #button>
          <!-- 获取验证码 -->
          <input
            type="button"
            class="right-btn"
            @click="getLoginCode"
            :disabled="codeFontDis"
            v-model="codeFont"
            :style="codeFontDis ? 'opacity:0.7;' : 'opacity:1;'"
        /></template>
      </van-field>
      <!-- 按钮 -->
      <div class="btn-group">
        <input
          @click="updatePhone"
          type="button"
          value="确认修改"
          class="v-btn"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  loginByCode,
  getLoginCode,
  updatePhone,
  getUpdateCode,
} from "@/api/user/users";
import { mapState } from "vuex";
export default {
  name: "ChangePhone",
  data() {
    return {
      // 旧号码是否本人（重新验证登录）
      isUser: false,
      oldCode: "",

      timer: "",
      // 新号码获取验证码
      newPhone: "",
      newCode: "",
      codeFont: "获取",
      codeFontDis: false,
      phoneReg:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
    };
  },
  computed: {
    ...mapState(["userInfo"]),
    getPhoneFormat() {
      return this.userInfo.phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
    },
  },
  methods: {
    // 1）请求验证码
    async getLoginCode() {
      if (this.timer !== "") {
        return;
      }
      if (!this.phoneReg.test(this.newPhone) && this.isUser) {
        return this.$toast("手机号格式错误！");
      }

      if (this.userInfo.phone === this.newPhone) {
        return this.$toast("新旧手机号不能一致！");
      }
      this.codeBtnInit(); // 获取按钮状态

      //  验证登录or修改新手机 验证码
      const res = this.isUser
        ? await getUpdateCode(this.newPhone, this.$store.getters.token)
        : await getLoginCode(this.userInfo.phone);
      if (res.status === 200 && res.data.code === 20011) {
        this.$notify({
          type: "success",
          message: `获取成功，请查看手机验证码！`,
          duration: 5000,
        });
        // this.$notify({
        //   type: "success",
        //   message: `获取成功！验证码为：\n${res.data.data}`,
        //   duration: 5000,
        // });
        // 剪切板
        // copyTextAsync(res.data.data)
        //   .then(() => {
        //     this.$toast("自动复制到剪切板！");
        //   })
        //   .catch();
        // if (!this.isUser) {
        //   // 验证旧登录
        //   this.oldCode = res.data.data; // 自动填写
        // } else {
        //   // 验证新手机
        //   this.newCode = res.data.data; // 自动填写
        // }
      } else {
        if (this.isUser) {
          this.$notify({
            type: "danger",
            message: `此手机号已被绑定！`,
          });
        } else {
          this.$notify({
            type: "danger",
            message: `错误，请稍后重试！`,
          });
        }
      }
    },

    // 2) 验证码登录
    async toLoginByReg() {
      // 验证码登录验证
      const res = await loginByCode(this.userInfo.phone, this.oldCode);
      if (res.status === 200 && res.data.code === 20011) {
        this.isUser = true; // 登录成功
        this.$notify({
          type: "success",
          message: `验证成功！`,
          duration: 1000,
        });
        // 修改token
        this.$store.commit("setToken", { token: res.data.data });
      } else {
        this.$notify({ type: "danger", message: "验证码错误！" });
      }
    },

    // 3) 更新手机号
    async updatePhone() {
      this.$toast.loading({ duration: 0, forbidClick: true });
      const res = await updatePhone(
        this.newPhone,
        this.newCode,
        this.$store.getters.token
      );
      this.$toast.clear();
      // console.log(res.data);
      if (res.status === 200 && res.dat.code === 20011) {
        this.$notify({ type: "success", message: "修改成功！" });
        this.$emit("input", false);
        this.$set(this.userInfo, "phone", this.newPhone);
        this.init();
      } else {
        this.$notify({ type: "danger", message: "修改失败！" });
      }
    },

    // 获取验证码按钮
    codeBtnInit() {
      this.codeFontDis = true;
      let times = 30;
      this.timer = setInterval(() => {
        times--;
        this.codeFont = times + "s";
        if (times === 0) {
          this.reCodeBtnInit();
        } else {
          this.codeFont = times + "s";
        }
      }, 1000);
    },
    // 重置获取按钮状态
    reCodeBtnInit() {
      this.codeFont = "获取";
      this.codeFontDis = false;
      clearInterval(this.timer);
      this.timer = "";
    },
    // 重置
    init() {
      this.reCodeBtnInit();
      this.isUser = false;
      this.oldCode = "";
      clearInterval(this.timer);
      this.timer = "";
      this.newPhone = ""; // 新号码获取验证码
      this.newCode = "";
      this.codeFont = "获取";
      this.codeFontDis = false;
    },
  },

  watch: {
    // 重置获取按钮状态
    isUser() {
      this.reCodeBtnInit();
    },
  },
};
</script>

<style scoped>
.first .title {
  padding: 0.5rem 0.3rem;
}
.btn-group {
  width: 100%;
}
</style>