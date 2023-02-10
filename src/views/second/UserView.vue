<template>
  <div class="user-view">
    <top-nav title="个人信息" @click-left="$router.back()" />
    <!-- 头像 -->
    <div class="contain flex-col" @click="showIconPanel = true">
      <div class="user-icon">
        <van-image
          :src="userIcon"
          round
          fit="cover"
          width="100%"
          height="100%"
        />
        <van-icon name="edit" size="0.5rem" class="flex-center-center tip" />
      </div>
    </div>
    <!-- 修改列表 -->
    <van-cell-group inset class="group">
      <van-cell @click="copyId(userInfo.id)" title="ID" :value="userInfo.id" />
      <van-cell
        @click="openInfoPanel(i, p.value)"
        :title="p.title"
        is-link
        :value="userInfo[p.value]"
        v-for="(p, i) in option"
        :key="p.title"
      />
    </van-cell-group>
    <!-- 头像弹窗 -->
    <change-icon v-model="showIconPanel" />
    <van-popup
      closeable
      class="flex-col info-popup"
      v-model="showInfoPanel"
      position="bottom"
      round
    >
      <label class="in-title">修改{{ option[active].title }}</label>
      <!-- 昵称 -->
      <van-field
        clear-trigger="always"
        placeholder=" 请输入新昵称"
        v-model="user.nickname"
        left-icon="contact"
        class="v-input"
        v-show="active === 0"
      />
      <!-- 新账号 -->
      <van-field
        clear-trigger="always"
        placeholder=" 请输入新账号"
        v-model="user.username"
        left-icon="friends-o"
        class="v-input"
        :disabled="isDisUsername"
        v-show="active === 1"
      />
      <!-- 电话 -->
      <change-phone v-show="active === 2" v-model="showInfoPanel" />
      <!-- 密码 -->
      <van-field
        placeholder=" 请输入旧密码"
        v-model="user.oldPwd"
        type="password"
        left-icon="contact"
        class="v-input"
        v-show="active === 3"
        @blur="checkPwd"
      />
      <van-field
        placeholder=" 请输入新密码"
        v-model="user.newPwd"
        type="password"
        left-icon="closed-eye"
        class="v-input"
        v-show="active === 3"
      />
      <!-- 按钮 -->
      <div class="btn-group" v-show="active !== 2">
        <input
          @click="showInfoPanel = false"
          type="button"
          value="取消"
          class="v-btn v-cancel"
        />
        <input @click="updateUser" type="button" value="保存" class="v-btn" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import TopNav from "@/components/TopNav.vue";
import { getResourImageByName } from "@/api/res";
import {
  updateNickName,
  updateUserName,
  changeUserPwd,
  loginByPwd,
  getIsNotUpdateUsername,
} from "@/api/user/users";
import { mapState } from "vuex";
import ChangeIcon from "@/components/My/ChangeIcon.vue";
import ChangePhone from "@/components/ChangePhone.vue";
import { Notify, Toast } from "vant";
import { copyTextAsync } from "@/util/copy";
export default {
  components: { TopNav, ChangeIcon, ChangePhone },
  name: "UserView",
  data() {
    return {
      showIconPanel: false,
      // 用户
      user: {
        nickname: "",
        username: "",
        oldPwd: "",
        newPwd: "", // 新密码
      },
      isDisUsername: false, // 是否修改过用户名
      showInfoPanel: false,
      isUpdatePwd: false,

      option: [
        {
          title: "昵称",
          value: "nickname",
          clickFn: async () => {
            if (this.user.nickname === this.userInfo.nickname) {
              return (this.showInfoPanel = false);
            } else if (this.user.nickname.trim() == "") {
              return Notify({
                message: `昵称不能为空！`,
                type: "danger",
              });
            }
            const res = await updateNickName(
              this.user.nickname.trim(),
              this.$store.getters.token
            );
            if (res.status === 200 && res.data.success) {
              Notify({ type: "success", message: "修改成功！" });
              this.showInfoPanel = false;
              this.$set(this.userInfo, "nickname", this.user.nickname);
            } else {
              Notify({ type: "danger", message: "该昵称已经存在！" });
            }
          },
        },
        {
          title: "账号",
          value: "username",
          clickFn: async () => {
            if (this.user.username === this.userInfo.username) {
              return (this.showInfoPanel = false);
            } else if (this.user.username.trim() == "") {
              return Notify({
                message: "用户名不能为空！",
                type: "danger",
              });
            }
            // 修改用户名
            const res = await updateUserName(
              this.user.username.trim(),
              this.$store.getters.token
            );
            if (res.status === 200 && res.data.success) {
              Notify({ type: "success", message: "修改成功！" });
              this.$set(this.userInfo, "username", this.user.username);
              this.showInfoPanel = false;
            } else {
              Notify({ type: "danger", message: "该用户名已存在！" });
            }
          },
        },
        {
          title: "手机号",
          value: "phone",
          clickFn: async () => {},
        },
        {
          title: "修改密码",
          value: "",
          clickFn: async () => {
            if (!this.isUpdatePwd) {
              return Notify({ type: "danger", message: "旧密码错误!" });
            }
            const res = await changeUserPwd(
              this.user.newPwd.trim(),
              this.user.oldPwd.trim(),
              this.$store.getters.token
            );
            if (res.status === 200 && res.data.success) {
              Notify({
                type: "success",
                message: "修改密码成功！",
                onClose: () => {
                  this.$store.commit("loginOut");
                  this.$router.push({
                    name: "login",
                    params: { animate: "forward" },
                  });
                },
              });
            } else {
              Notify({ type: "danger", message: "修改密码失败！" });
            }
          },
        },
      ],
      active: 0,
    };
  },
  mounted() {
    // this.checkIsUpdateUsername();
  },
  methods: {
    // 提交请求
    updateUser() {
      // 运行对应请求
      this.option[this.active].clickFn();
      // 重置
      this.nickname = "";
      this.username = "";
      this.pwd = "";
      this.newPwd = "";
    },

    // 验证pwd
    async checkPwd() {
      if (!this.user.oldPwd.trim()) return;
      const res = await loginByPwd(
        this.userInfo.username.trim(),
        this.user.oldPwd.trim()
      );
      if (res.status !== 200 || !res.data.success) {
        Notify({ type: "danger", message: "旧密码错误！" });
      }
      this.isUpdatePwd = res.data.success;
    },

    // 验证是否修改过用户名
    async checkIsUpdateUsername() {
      const res = await getIsNotUpdateUsername(this.$store.getters.token);
      if (res.status !== 200 || !res.data.success) {
        this.isDisUsername = true;
      }
      console.log(res.data);
    },

    // 打开弹窗
    openInfoPanel(i, key) {
      this.showInfoPanel = true;
      this.active = i;
      if (i <= 1) {
        this.user.nickname = this.userInfo[key];
        this.user.username = this.userInfo[key];
      }
    },

    // 复制ID
    copyId(text) {
      copyTextAsync(text)
        .then(() => {
          Toast({ message: "复制成功！", position: "bottom" });
        })
        .catch(() => {
          Toast({ message: "用户取消了复制！", position: "bottom" });
        });
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    // 获得头像
    userIcon() {
      return getResourImageByName(this.userInfo?.icon);
    },
  },
};
</script>

<style soped>
.contain {
  align-items: center;
  padding: 0.2rem 0.3rem;
}
/* 底部修改头像 */
.user-icon {
  width: 3rem;
  height: 3rem;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  margin: 0.4rem 0;
}
.user-icon .tip {
  position: absolute;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background-color: var(--theme-color2);
  padding: 0.15rem;
  color: var(--text-color);
  border: 3px solid var(--theme-color);
}
/* 列表组 */
.group {
  box-shadow: var(--shadow-color);
  margin: 0.3rem 0.6rem;
}
.group .van-cell__title {
  color: var(--text-color3);
}
.group .van-cell__value {
  cursor: pointer;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-color4);
}
/* 输入弹窗 */
.in-title {
  font-size: 0.5rem;
  font-weight: 600;
  text-align: center;
  padding: 0.3rem 0;
}

.info-popup {
  padding: 0.3rem 0.4rem;
}
.info-popup .v-input {
  padding: 0.2rem 0.4rem;
  margin: 0.2rem 0;
}
.btn-group {
  width: 100%;
  margin: 0.3rem 0;
}

.code .v-btn {
  font-size: 0.2rem;
  box-shadow: none;
  padding: 0 0.5rem;
  opacity: 0.2rem;
}
</style>