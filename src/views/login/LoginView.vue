<template>
  <div>
    <!-- 顶部导航栏 -->
    <TopNav :title="title" @click-left="onClickLeft" />

    <!-- 表单 -->
    <div class="froms">
      <van-form @submit="toSubmit">
        <van-field
          v-model="username"
          name="username"
          :type="isUserPwd ? 'text' : 'tel'"
          left-icon="contact"
          :placeholder="isUserPwd ? ' 请填写用户名' : ' 请填写手机号'"
          :rules="[{ required: true }]"
          @blur="phoneCheck"
          class="v-input"
        />
        <van-field
          v-if="isUserPwd"
          v-model="password"
          type="password"
          left-icon="eye-o"
          name="password"
          placeholder=" 请填写密码"
          class="v-input"
          :rules="[{ required: true }]"
        />
        <van-field
          v-if="!isUserPwd"
          v-model="code"
          type="number"
          left-icon="label-o"
          name="code"
          placeholder=" 验证码"
          class="v-input"
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
            />
          </template>
        </van-field>
        <van-field
          v-if="isUpdatePwd && isUpdateCodeCheck"
          v-model="newPassword"
          type="password"
          left-icon="eye-o"
          name="password"
          placeholder=" 新密码"
          class="v-input"
          :rules="[{ required: true }]"
        />
        <!-- 中底部文字按钮 -->
        <div class="center-tips">
          <van-checkbox
            v-model="savePwd"
            icon-size="0.4rem"
            v-show="!isUpdatePwd"
          >
            自动登录
          </van-checkbox>
          <div class="right" style="margin-left: auto">
            <div
              style="cursor: pointer"
              @click="
                {
                  isUserPwd = !isUserPwd;
                  isUpdatePwd = !isUpdatePwd;
                }
              "
              v-show="isUserPwd"
            >
              {{ "忘记密码" }}&nbsp;|&nbsp;
            </div>
            <div
              style="cursor: pointer"
              @click="
                {
                  isUserPwd = !isUserPwd;
                  isUpdatePwd = false;
                }
              "
            >
              {{ isUserPwd ? "验证码登录" : "账号登录" }}
            </div>
          </div>
        </div>
        <div class="btns" v-if="!isUpdatePwd">
          <input class="v-btn login-btn" type="submit" value="登录" />
          <input
            class="v-btn reg-btn"
            type="button"
            value="注册"
            @click="onClickRight"
          />
        </div>
        <div class="btns" v-else>
          <input
            v-if="!isUpdateCodeCheck"
            class="v-btn reg-btn update-btn"
            type="submit"
            value="验证"
          />
          <input
            v-else
            class="v-btn login-btn update-btn"
            type="submit"
            value="修改密码"
          />
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
import router from "@/router";
import { Dialog, Notify } from "vant";
import TopNav from "@/components/TopNav.vue";
import {
  getLoginCode,
  loginByPwd,
  loginByCode,
  checkUser,
  getUpdatePwdCode,
  checkUpdatePwdCode,
  updatePwd,
} from "@/api/user/users";
export default {
  name: "LoginFrom",
  components: { TopNav },

  data() {
    return {
      title: "登 录",
      rTitle: "去注册",
      isUserPwd: true,
      username: "",
      password: "",
      newPassword: "",
      code: "",
      codeFont: "获取",
      codeFontDis: false,
      savePwd: false, // 记住密码

      isUpdatePwd: false, // 忘记密码
      isUpdateCodeCheck: false, // 忘记密码--验证码通过
      phoneReg:
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
    };
  },

  mounted() {
    // 判断自动登录
    this.autoLogin();
  },
  methods: {
    // 表单提交
    toSubmit() {
      if (this.isUserPwd) {
        this.toLoginByPwd(); // 密码登录
      } else if (!this.isUpdatePwd && !this.isUpdatePwd) {
        this.toLoginByReg(); // 验证码登录
      } else if (this.isUpdatePwd && !this.isUpdateCodeCheck) {
        this.checkUpdateCode(); // 验证修改密码的验证码
      } else {
        this.toForgetPwd(); // 修改密码
      }
    },
    // 1）密码登录
    async toLoginByPwd() {
      let res = await loginByPwd(this.username, this.password);
      if (res.status === 200 && res.data.success) {
        // 记住密码
        if (this.savePwd) {
          localStorage.setItem(this.$store.state.TOKEN_NAME, res.data.data);
        } else {
          sessionStorage.setItem(this.$store.state.TOKEN_NAME, res.data.data);
        }
        this.reqUserInfo(res.data.data);
        // 查询用户信息
        Notify({ type: "success", message: "登录成功！" });
        this.toView();
      } else {
        // console.log(res.data);
        Notify({
          type: "danger",
          message: this.isUserPwd ? "账号密码错误！" : "验证码有误！",
        });
      }
    },

    // 2）验证码登录
    async toLoginByReg() {
      // 验证码登录
      const res = await loginByCode({
        phone: this.username,
        code: this.code,
      });
      if (res.status === 200 && res.data?.success) {
        // 记住密码
        if (this.savePwd) {
          localStorage.setItem(this.$store.state.TOKEN_NAME, res.data.data);
        } else {
          sessionStorage.setItem(this.$store.state.TOKEN_NAME, res.data.data);
        }
        // 查询用户信息
        this.reqUserInfo(res.data.data);
        Notify({ type: "success", message: "登录成功！" });
        this.toView();
      } else {
        Notify({
          type: "danger",
          message: res.data?.message ?? "用户不存在，请进行注册",
        });
      }
    },
    // 请求获取登录||忘记密码 验证码
    async getLoginCode() {
      if (!this.username) {
        return Notify("手机号不能为空！");
      } else if (!this.phoneCheck()) {
        return Notify("手机号格式错误！");
      }
      this.codeFontDis = true;
      let times = 30;
      let timer = setInterval(() => {
        times--;
        this.codeFont = times + "s";
        if (times === 0) {
          this.codeFont = "获取";
          this.codeFontDis = false;
          clearInterval(timer);
        } else {
          this.codeFont = times + "s";
        }
      }, 1000);
      // 判断登录 || 忘记密码 验证码
      const res = this.isUpdatePwd
        ? await getUpdatePwdCode(this.username)
        : await getLoginCode(this.username);
      if (res.data?.success) {
        Notify({
          type: "success",
          message: `获取成功！验证码为：\n${res.data.data}`,
          duration: 5000,
        });

        this.code = res.data.data; // 自动填写
      } else {
        Notify({
          type: "danger",
          message: `此手机号未注册！`,
        });
      }
    },

    // 3）忘记密码
    async toForgetPwd() {
      const res = await updatePwd({
        phone: this.username,
        newPassword: this.newPassword,
      });
      if (res.data?.success) {
        Notify({
          type: "success",
          message: `修改成功！`,
          onClose: () => {
            this.password = "";
            this.newPassword = "";
            this.code = "";
            this.isUserPwd = true;
            this.savePwd = false;
            this.isUpdatePwd = false;
            this.isUpdateCodeCheck = false;
          },
        });
      } else {
        Notify({
          type: "danger",
          message: `验证码已经失效`,
        });
      }
    },
    // 4）验证--修改密码的验证码
    async checkUpdateCode() {
      if (this.isUpdatePwd) {
        const res = await checkUpdatePwdCode({
          phone: this.username,
          code: this.code,
        });
        if (res.status === 200 && res.data.success) {
          this.isUpdateCodeCheck = true;
          Notify({
            type: "success",
            message: `验证通过！`,
          });
        } else {
          Notify({
            type: "danger",
            message: `验证码错误！`,
          });
        }
      }
    },
    // 跳转
    toView() {
      this.$store.commit("setLoginState", true); // vuex保存登录状态

      if (this.$route.params.toBack) {
        this.$router.back();
      } else {
        this.$router.push({
          name: "home",
          params: { animate: "forward" },
        });
      }
    },

    // 登录成功--查询请求用户信息
    reqUserInfo(token) {
      // 添加用户登录状态
      const time = new Date().getTime(); // 获取时间戳
      localStorage.setItem("loginTime", time);
      this.$store.commit("setToken", token);
      this.$store.commit("setLoginTime", time);
      // 检查用户
      checkUser(token).then((res) => {
        if (res.data.success) {
          this.$store.commit("setUserInfo", res.data.data);
        } else {
          this.$store.commit("loginOut");
        }
      });
    },
    // 顶部导航栏
    onClickLeft() {
      router.back();
    },
    onClickRight() {
      router.replace({
        name: "regist",
        params: { animate: "forward" },
      });
    },
    // 校验手机号
    phoneCheck() {
      if (!this.isUserPwd) {
        if (this.username !== "" && !this.phoneReg.test(this.username.trim())) {
          Notify({ type: "danger", message: "手机号格式错误！" });
          return false;
        }
        return this.phoneReg.test(this.username.trim());
      }
    },

    // 自动登录
    async autoLogin() {
      // 获取注册的用户信息
      if (this.$route.params?.username)
        this.username = this.$route.params.username;
      // 获取登录状态
      const token =
        localStorage.getItem(this.$store.state.TOKEN_NAME) ||
        sessionStorage.getItem(this.$store.state.TOKEN_NAME) ||
        "";

      this.$store.commit("setToken", token); // vuex保存token
      if (token === "") return;
      const res = await checkUser(token);
      if (!res.data.success || res.status !== 200) {
        this.password = "";
        this.$store.commit("loginOut"); // 登出
        this.$toast({ type: "fail", message: "登录过期，请重新登陆" });
        return;
      }
      let second = 2;
      let timer;
      // 自动登录弹窗
      if (res.data?.success) {
        this.password = "..*****...";
        this.savePwd = true;
        this.username = res.data.data.username;
        Dialog.alert({
          message: "自动登录中...",
          confirmButtonText: "取消",
        }).then(() => {
          clearInterval(timer);
          this.password = "";
          this.$store.commit("loginOut"); // 登出
        });

        timer = setInterval(() => {
          second--;
          if (!second) {
            this.$store.commit("setUserInfo", res.data.data);
            this.toView(); // 跳转主页
            Dialog.close(); // 关闭弹窗
          }
        }, 1000);
      }
    },
  },
  watch: {
    isUserPwd(newVal) {
      if (newVal) {
        this.title = "登 录";
      } else {
        this.title = "修改密码";
      }
    },
  },
};
</script>
<style scoped>
.center-tips {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.38rem;
  margin: 0.3rem 0.2rem;
  color: rgba(0, 0, 0, 0.9);
}
.center-tips .right {
  display: flex;
  align-items: center;
}
.btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.8rem;
}
.btns .update-btn {
  width: 100%;
  padding: 0.3rem;
  font-size: 0.45rem;
}
.reg-btn {
  border: 2px solid #eee;
  background-color: #fff;
  box-shadow: #eee -3px -3px 5px, #eee 3px 3px 5px;
}
.reg-btn:hover {
  box-shadow: none;
}
.reg-btn:active {
  box-shadow: none;
}
</style>
