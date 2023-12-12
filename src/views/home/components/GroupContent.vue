<template>
  <div>GroupContent</div>
</template>
<script lang="ts" setup>
import { defineProps, watch } from "vue";
const props = defineProps({
  groupData: Object,
});

watch(
  () => props.groupData,
  (newVal) => {
    console.log(newVal);
  },
  { deep: true }
);


</script>
<style lang=""></style>
