<template>
  <t-layout style="height: 100vh;">
    <t-header>
      <t-head-menu theme="light" value="item1" height="120px">
        <template #operations>
          <t-popup content="个人页">
            <t-button variant="text" shape="square" @click="handleClickUser">
              <template #icon><t-icon name="user" /></template>
            </t-button>
          </t-popup>
          <t-popup content="退出登录">
            <t-button variant="text" shape="square" @click="handleClickLogout">
              <template #icon><t-icon name="logout" /></template>
            </t-button>
          </t-popup>
        </template>
      </t-head-menu>
    </t-header>
    <t-content style="flex: 1; overflow: hidden;">
      <router-view />
    </t-content>
  </t-layout>
</template>
<script setup lang="ts">

const handleClickUser = () => {
  console.log('click user');
}

const handleClickLogout = () => {
  console.log('click logout');
}

</script>
<style lang="">
</style>
