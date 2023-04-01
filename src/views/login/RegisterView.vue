<template>
  <div>
    <!-- 顶部导航栏 -->
    <TopNav :title="title" @click-left="onClickLeft" />

    <!-- 表单 -->
    <div class="froms">
      <van-form @submit="disabled ? '' : toRegister()">
        <van-field
          :disabled="disabled"
          v-model="username"
          name="username"
          type="text"
          class="v-input"
          left-icon="contact"
          placeholder=" 用户名（开头字母、数字和下划线组成）"
          :rules="[{ required: true }]"
          @blur="checkUsername"
        />
        <van-field
          v-model="phone"
          :disabled="disabled"
          type="tel"
          name="phone"
          class="v-input"
          left-icon="phone-o"
          placeholder=" 请填写手机号"
          :rules="[{ required: true }]"
          @blur="phoneCheck"
        />
        <van-field
          :disabled="disabled"
          v-model="code"
          type="number"
          name="code"
          left-icon="label-o"
          placeholder=" 验证码"
          class="v-input"
          :rules="[{ required: true }]"
        >
          <template #button>
            <!-- 获取验证码 -->
            <input
              type="button"
              class="right-btn"
              @click="getRegisterCode"
              :disabled="codeFontDis || disabled"
              v-model="codeFont"
              :style="codeFontDis ? 'opacity:0.7;' : 'opacity:1;'"
            />
          </template>
        </van-field>
        <van-field
          v-model="password"
          :disabled="disabled"
          type="password"
          name="password"
          class="v-input"
          left-icon="eye-o"
          placeholder=" 请填写密码"
          :rules="[{ required: true }]"
        />
        <input
          class="v-btn"
          :disabled="disabled"
          style="width: 100%; padding: 0.3rem; font-size: 0.45rem"
          type="submit"
          value="立即注册"
        />
      </van-form>
    </div>
  </div>
</template>
<script>
import { register, getRegisterCode } from "@/api/user/users";

import TopNav from "@/components/TopNav.vue";
import { Notify } from "vant";
export default {
  name: "RegisterFrom",
  components: { TopNav },
  data() {
    return {
      disabled: false, // 全局禁用
      title: "注 册",
      username: "",
      phone: "",
      code: "",
      password: "",
      usernameReg: /^[a-zA-Z]/,
      phoneReg:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
      codeFont: "获取",
      codeFontDis: false,
    };
  },
  methods: {
    // 请求注册
    async toRegister() {
      if (!this.checkUsername()) return;
      if (!this.phoneCheck()) return;
      const res = await register({
        username: this.username.trim(),
        phone: this.phone.trim(),
        code: this.code.trim(),
        password: this.password.trim(),
      });
      // console.log(res.data);
      if (res.data.code === 20011) {
        this.disabled = true;
        Notify({ type: "success", message: "注册成功！即将返回登录" });
        setTimeout(() => {
          this.$router.replace({
            name: "login",
            params: { username: this.username },
          }); // 两秒后跳转登录页面
          this.disabled = false;
        }, 2000);
      } else {
        Notify({ type: "danger", message: "该用户已被注册！" });
      }
    },
    // 请求获取注册验证码
    async getRegisterCode() {
      if (!this.phone) {
        return Notify("手机号不能为空！");
      } else if (!this.phoneCheck()) {
        return Notify("手机号格式错误！");
      }
      this.codeFontDis = true;
      let times = 60;
      let timer = setInterval(() => {
        if (times === 1) {
          this.codeFont = "获取";
          clearInterval(timer);
        }
        times--;
        if (times === 0) {
          this.codeFont = "获取";
          this.codeFontDis = false;
          clearInterval(timer);
        } else {
          this.codeFont = times + "s";
        }
      }, 1000);
      const res = await getRegisterCode(this.phone);
      // console.log(res.data);
      if (res.data.code === 20011) {
        Notify({
          type: "success",
          // message: `获取成功！验证码为：\n${res.data.data}`,
          message: `获取成功,请查看手机验证码！`,
        });
        // this.code = res.data.data; // 自动填写
      } else {
        Notify({
          type: "danger",
          message: `获取失败！手机号已被注册！`,
        });
      }
    },

    // 校验
    phoneCheck() {
      if (this.phone !== "" && !this.phoneReg.test(this.phone.trim())) {
        Notify({ type: "danger", message: "手机号格式错误！" });
        return false;
      }
      return this.phoneReg.test(this.phone.trim());
    },
    checkUsername() {
      if (
        this.username !== "" &&
        !this.usernameReg.test(this.username.trim())
      ) {
        Notify({ type: "danger", message: "用户名格式错误！" });
        return false;
      }
      return this.usernameReg.test(this.username.trim());
    },
    // 顶部导航按钮
    onClickLeft() {
      this.$router.replace({
        name: "login",
        params: { animate: "toback" },
      });
    },
  },
};
</script>
<style scoped></style>
