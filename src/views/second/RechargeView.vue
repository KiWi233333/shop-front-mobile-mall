<template>
  <default-page title="积分卡">
    <div class="v-card animate__animated animate__fadeInLeft">
      <div class="left">
        <div class="title">积分：</div>
        <div class="points">{{ purseInfo?.points }}</div>
      </div>
      <div class="right"></div>
    </div>
  </default-page>
</template>

<script>
import DefaultPage from "@/components/DefaultPage.vue";
import { mapState } from 'vuex';
export default {
  components: { DefaultPage },
  name: "RechargeView",
  computed:{
    ...mapState(['purseInfo'])
  },
};
</script>

<style scoped> 
.v-card {
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 0.6rem 0.8rem;
}
.v-card .left {
  font-weight: 600;
  line-height: 0.8rem;
}
.left .points {
  font-size: 0.8rem;
  color: var(--text-color);
} 

</style>