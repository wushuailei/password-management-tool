<template>
  <div class="home">
    <div class="home-sidebar">
      <t-menu
        v-model="currentMenuItem"
        theme="light"
        @change="handleChangeMenu"
      >
        <t-loading size="small" :loading="sidebarLoading" show-overlay>
          <t-menu-item
            v-for="(item, index) in groupList"
            :key="item._id"
            :value="index"
            >{{ item.groupName }}</t-menu-item
          >
        </t-loading>
        <template #operations>
          <t-popup content="添加组">
            <t-button
              variant="text"
              shape="square"
              @click="handleClickAddGroup"
            >
              <template #icon><t-icon name="add" /></template>
            </t-button>
          </t-popup>
          <t-popup content="编辑组">
            <t-button
              variant="text"
              shape="square"
              @click="handleClickEditGroup"
            >
              <template #icon><t-icon name="edit" /></template>
            </t-button>
          </t-popup>
          <t-popconfirm theme="danger" content="确认删除吗" @confirm="handleClickDelGroup">
              <t-popup content="删除组">
                <t-button
                  variant="text"
                  shape="square"
                >
                  <template #icon><t-icon name="delete" /></template>
                </t-button>
              </t-popup>
            </t-popconfirm>
          <t-popup content="刷新组">
            <t-button
              variant="text"
              shape="square"
              @click="handleClickRefreshGroup"
            >
              <template #icon><t-icon name="refresh" /></template>
            </t-button>
          </t-popup>
        </template>
      </t-menu>
    </div>

    <!-- 组内容 -->
    <div class="group-content">
      <GroupContent v-if="currentMenuItem !== null" />
      <t-skeleton loading v-else></t-skeleton>
    </div>
  </div>

  <!-- 组操作抽屉 -->
  <GroupOperationDrawer
    ref="refGroupOperationDrawer"
    @clickConfirm="onClickDrawerConfirm"
  />
</template>
<script setup lang="ts">
import { ref, provide } from "vue";
import { MessagePlugin } from "tdesign-vue-next";
import GroupContent from "./components/GroupContent.vue";
import GroupOperationDrawer from "./components/GroupOperationDrawer.vue";
import { queryGroupList, delGroup } from "@/api/group";

const currentMenuItem = ref<any>(null);
const groupList = ref(<any>[]);
const sidebarLoading = ref(false);
// 切换菜单
const handleChangeMenu = (value: number) => {
  currentMenuItem.value = value;
  groupInfo.value = groupList.value[value];
};
// 添加组
const handleClickAddGroup = () => {
  refGroupOperationDrawer.value?.showDrawer({ drawerType: 1 });
};
// 编辑组
const handleClickEditGroup = () => {
  if (currentMenuItem.value === null) {
    MessagePlugin.warning("请选择组");
    return;
  }
  refGroupOperationDrawer.value?.showDrawer({
    ...groupList.value[currentMenuItem.value],
    drawerType: 2,
  });
};
// 删除组
const handleClickDelGroup = () => {
  if (currentMenuItem.value === null) {
    MessagePlugin.warning("请选择组");
    return;
  }
  delGroup({ _id: groupList.value[currentMenuItem.value]._id }).then(() => {
    handleClickRefreshGroup();
    MessagePlugin.success("删除成功");
  });
};
// 刷新组列表
const handleClickRefreshGroup = () => {
  sidebarLoading.value = true;
  queryGroupList()
    .then((res: any) => {
      currentMenuItem.value = null
      groupList.value = res.data;
    })
    .finally(() => {
      sidebarLoading.value = false;
    });
};

// 表格数据源
const groupInfo = ref(<any>{});

// 初始化组列表
handleClickRefreshGroup();

// 组操作抽屉
const refGroupOperationDrawer =
  ref<InstanceType<typeof GroupOperationDrawer>>();
// 点击抽屉确认按钮
const onClickDrawerConfirm = () => {
  console.log("click confirm");
  handleClickRefreshGroup();
};

// 依赖注入
provide("groupInfo", groupInfo);
</script>
<style lang="less" scoped>
.home {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #f5f5f5;
  box-sizing: border-box;
  .home-sidebar {
    height: 100%;
    overflow: auto;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: auto;
  }
  .group-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #fff;
    border-radius: 4px;
    margin: 20px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: relative;
  }
}
</style>
