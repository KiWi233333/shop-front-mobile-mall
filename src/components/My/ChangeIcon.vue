<template>
  <!-- 头像弹窗 -->
  <van-popup
    transition="popup"
    class="icon-popup"
    closeable
    round
    v-model="show"
    duration="0.24"
    @open="open"
    position="center"
    :style="{ width: '80%', height: '8rem', margin: '0 auto' }"
  >
    <div class="flex-col icon-ctn">
      <span class="title">上传头像</span>
      <van-uploader
        class="update"
        accept="image/png, image/jpeg, image/jpg,"
        v-model="imgList"
        preview-size="3rem"
        :max-count="1"
        :max-size="500 * 1024"
        @oversize="overSizeFile"
        :preview-options="{ closeable: true }"
        :after-read="uploadIcon"
      />
      <div class="btn-group">
        <input
          type="button"
          @click="show = false"
          value="取消"
          class="v-btn v-cancel"
        />
        <input
          type="submit"
          @click="updateIconPathInfo"
          value="确定"
          class="v-btn"
        />
      </div>
    </div>
  </van-popup>
</template>

<script>
import { mapState } from "vuex";
import { postUserIcon, updateUserIcon } from "@/api/user/users";
import { getResourImageByName } from "@/api/res";
export default {
  name: "ChangeIcon",
  props: ["value"],
  data() {
    return {
      show: false,
      imgList: [], // 头像
      uploadPath: "", // 上传后的地址
      isUpload: false,
    };
  },
  methods: {
    // 上传头像
    async uploadIcon(file) {
      if (!file?.content) {
        return (this.show = false);
      }

      this.isUpload = true;
      file.status = "uploading";
      file.message = "上传中...";
      // 上传图片
      const fileRes = await postUserIcon(
        this.imgList[0],
        this.$store.getters.token
      );
      // 上传头像文件
      if (fileRes.status !== 200 || !fileRes.data.code === 20011) {
        file.status = "failed";
        file.message = "上传失败";
        return this.$toast({ type: "fail", message: "上传失败！" });
      } else {
        this.uploadPath = fileRes.data.data;
        file.status = "done";
        file.message = "";
        this.isUpload = false;
      }
    },

    // 修改头像
    async updateIconPathInfo() {
      if (this.isUpload) {
        return this.$toast("正在上传...");
      }
      // 修改头像
      const res = await updateUserIcon(
        this.uploadPath,
        this.$store.getters.token
      );
      if (res.status !== 200 || !res.data.code === 20011)
        return this.$toast({ type: "fail", message: "修改失败！" });
      // 修改成功
      this.$set(this.userInfo, "icon", this.uploadPath);
      this.show = false;
      this.$notify({ type: "success", message: "修改成功！" });
    },

    // 图片
    open() {
      this.$set(this.imgList, [0], { url: this.userIcon });
    },
    // 文件大小
    overSizeFile() {
      this.$toast(`大小不能超过 500kb`);
    },
  },
  computed: {
    ...mapState(["userInfo"]),
    userIcon() {
      return getResourImageByName(this.userInfo?.icon);
    },
  },
  watch: {
    value(newVal) {
      this.show = newVal;
    },
    show(newVal) {
      this.$emit("input", newVal);
    },
  },
};
</script>

<style scpoed>
/* 修改头像 */
.icon-ctn {
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.3rem;
  height: 100%;
  width: 100%;
}
.icon-ctn .title {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  font-weight: 600;
  margin: 0.3rem 0;
}
.btn-group {
  display: flex;
  width: 80%;
  margin: 0.2rem 0;
  justify-content: space-around;
}
.btn-group .v-btn {
  padding: 0.15rem 0.6rem;
}
</style>