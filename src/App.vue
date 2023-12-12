<script setup lang="ts">
import LayoutVue from './layout/Layout.vue';
</script>

<template>
  <LayoutVue v-if="$route.name !== 'Login'">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </LayoutVue>
  <router-view v-else></router-view>
</template>

<style scoped></style>
