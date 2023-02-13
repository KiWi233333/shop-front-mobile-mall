<template>
  <default-page class="sginin-view" title="关于个人">
    <div class="user-view">
      <div class="title">修改信息</div>
      <!-- 修改列表 -->
      <!-- <van-cell-group inset class="group">
        <van-cell
          @click="copyId(userInfo.id)"
          title="ID"
          :value="userInfo.id"
        />
        <van-cell
          @click="openInfoPanel(i, p.value)"
          :title="p.title"
          is-link
          :value="userInfo[p.value]"
          v-for="(p, i) in option"
          :key="p.title"
        />
      </van-cell-group> -->
    </div>
  </default-page>
</template>
<script>
import DefaultPage from "./DefaultPage.vue";
export default {
  components: { DefaultPage },
  name: "CollectView",
  data() {
    return {};
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