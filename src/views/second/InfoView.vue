<template>
  <default-page class="sginin-view" title="基本信息">
    <div class="user-view">
      <div class="contain">
        <div class="user-icon">
          <van-image
            :src="getImgSrc()"
            round
            fit="cover"
            width="100%"
            height="100%"
          />
        </div>
        <!-- 修改列表 -->
        <van-form class="group" @submit="saveChangeInfo">
          <!-- ID -->
          <div class="item">
            <span>ID</span>
            <div
              class="v-input"
              style="cursor: pointer; padding-right: 0.3rem"
              @click="copyText(id)"
            >
              {{ id }}
            </div>
          </div>
          <div class="item" v-for="(key, i) in Object.keys(info)" :key="i">
            <span>{{ infoText[key].name }}</span>
            <van-field
              input-align="right"
              :type="infoText[key].type"
              :rules="infoText[key].rules?.length ? infoText[key].rules : []"
              placeholder="未填写"
              v-model="info[key]"
              :name="key"
              class="v-input"
              :disabled="!isEdit || key === 'age'"
            />
          </div>
          <div class="btn-group">
            <input
              type="button"
              value="编辑"
              class="v-btn v-click v-cancel"
              @click="isEdit = !isEdit"
            />
            <input type="submit" value="保存" class="v-btn v-click" />
          </div>
        </van-form>
      </div>
    </div>
  </default-page>
</template>
<script>
import { getResourImageByName } from "@/api/res";
import DefaultPage from "@/components/DefaultPage.vue";
import { getBaseInfo, updateBaseInfo } from "@/api/user/info";
import { copyTextAsync } from "@/util/copy";
export default {
  components: { DefaultPage },
  name: "InfoView",
  data() {
    return {
      id: "",
      isEdit: false,
      info: {
        fullName: "",
        gender: "",
        age: "",
        email: "",
        birthday: "",
        qq: "",
      },
      infoText: {
        fullName: {
          name: "姓名",
          type: "text",
          rules: [{ required: true }],
        },
        gender: {
          name: "性别",
          type: "text",
          rules: [{ validator: this.changeSex, required: true }],
        },
        age: {
          name: "年龄",
          type: "number",
          rules: [{ validator: this.changeAge, required: true }],
        },
        email: {
          name: "电子邮箱",
          type: "email",
          rules: [
            {
              pattern:
                /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              required: true,
            },
          ],
        },
        birthday: {
          name: "生日",
          type: "date",
          rules: [{ required: true }],
        },
        qq: {
          name: "QQ",
          type: "number",
          rules: [{ pattern: /^\d{5,10}$/, required: true }],
        },
      },
    };
  },
  mounted() {
    // 基本信息
    this.getUserBaseInfo();
  },
  methods: {
    // 获取基本信息
    async getUserBaseInfo() {
      const res = await getBaseInfo(this.$store.getters.token);
      if (res.status === 200 && res.data.code === 20011) {
        const data = res.data.data;
        this.info.fullName = data?.fullName;
        this.info.gender = data?.gender;
        this.info.email = data?.email;
        this.info.qq = data?.qq;
        this.info.age = data?.age;
        this.info.birthday = data?.birthday;
        this.id = data?.id;
      }
    },

    // 保存请求
    async saveChangeInfo() {
      // console.log(this.info);
      const res = await updateBaseInfo(this.info, this.$store.getters.token);
      if (res.status === 200 && res.data.code === 20011) {
        this.$notify({ type: "success", message: " 修改成功！" });
        this.isEdit = false;
      } else {
        this.$notify({ type: "warning", message: " 修改失败！" });
      }
    },

    // 获取头像
    getImgSrc() {
      return getResourImageByName(this.$store.state.userInfo.icon);
    },

    // changeAge
    changeAge(val) {
      return val > 0 && val < 180;
    },
    // changeSex
    changeSex(val) {
      this.info.gender = val.trim();
      if (val.trim() === "男") {
        return true;
      } else if (val.trim() === "女") {
        return true;
      } else if (val.trim() === "保密") {
        return true;
      } else {
        return false;
      }
    },

    // copyText
    copyText(val) {
      copyTextAsync(val)
        .then(() => {
          this.$toast({ message: "复制成功！", position: "bottom" });
        })
        .catch(() => {
          this.$toast({ message: "复制失败！", position: "bottom" });
        });
    },
  },
  watch: {
    "info.birthday"() {
      let birthday = new Date(this.info.birthday);
      let d = new Date();
      let year =
        d.getFullYear() -
        birthday.getFullYear() -
        (d.getMonth() < birthday.getMonth() ||
        (d.getMonth() == birthday.getMonth() &&
          d.getDate() < birthday.getDate())
          ? 1
          : 0);
      this.info.age = year > 0 ? year : "";
    },
  },
};
</script>  
<style scoped>
.contain {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.2rem 0.3rem;
}
/* 表单组 */
.group {
  width: 100%;
  padding: 0.2rem 0.3rem;
}
.title {
  text-align: center;
  font-size: 0.5rem;
}
.group .item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  margin: 0.1rem 0;
}
.group .item .v-input {
  width: 60%;
  border: none;
  background-color: transparent;
  border-radius: 6px;
  text-align: right;
  margin: 0.1rem 0;
}
.item span {
  display: inline-block;
  color: var(--text-color4);
  opacity: 0.8;
  letter-spacing: 0.05rem;
}

/* 头像 */
.user-icon {
  width: 3rem;
  height: 3rem;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  margin: 0.4rem 0;
  border: 0.1rem solid var(--border-color);
  border-radius: 50%;
}
/* 按钮 */
.btn-group {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}
</style>