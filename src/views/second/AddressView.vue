<template>
  <div class="signin-view">
    <top-nav
      title="收货地址"
      @click-left="$router.back()"
      :rTitle="isSelectAll ? '完 成' : '管 理'"
      @click-right="isSelectAll = !isSelectAll"
    />
    <div class="contain">
      <address-list :isSelectAll="isSelectAll" />
    </div>
  </div>
</template>

<script>
import AddressList from "@/components/address/AddressList.vue";
import TopNav from "@/components/TopNav.vue";
export default {
  components: { AddressList, TopNav },
  name: "AddressView",
  data() {
    return {
      isSelectAll: false,
    };
  },
};
</script>
<style scpoed>
.contain {
  padding: 0.2rem 0.3rem;
}
</style>
