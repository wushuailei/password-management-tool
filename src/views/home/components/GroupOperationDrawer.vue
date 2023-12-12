<template>
  <t-drawer
    v-model:visible="visible"
    :header="drawerConfig.headerTitle"
    :footer="drawerConfig.footerShow"
    :on-confirm="handleClickConfirm"
    :closeOnOverlayClick="false"
    :close-btn="true"
    @close="handleCloseDrawer"
    size="70%"
  >
    <t-form ref="refForm" :rules="formRules" :data="formData" :colon="true">
      <t-form-item label="组名" name="groupName">
        <t-input
          v-model="formData.groupName"
          placeholder="请输入组名"
        ></t-input>
      </t-form-item>
    </t-form>
    <t-divider></t-divider>
    <t-button style="margin-bottom: 10px" @click="handleClickAddCol"
      >新增列</t-button
    >
    <t-table
      row-key="index"
      :data="tableData"
      :columns="tableColumns"
      table-layout="fixed"
      dragSort="row-handler"
      :max-height="300"
      bordered
      lazy-load
      @drag-sort="handleDragSort"
    >
      <template #operation="{ row, rowIndex }">
        <t-link
          theme="primary"
          hover="color"
          @click="handleClickEditColData(row, rowIndex)"
        >
          修改
        </t-link>
        <t-divider layout="vertical" />
        <t-popconfirm
          content="确认删除吗"
          theme="warning"
          @confirm="handleClickDelColData(rowIndex)"
        >
          <t-link theme="primary" hover="color"> 删除 </t-link>
        </t-popconfirm>
        <t-divider layout="vertical" />
        <t-link
          theme="primary"
          hover="color"
          @click="handleClickSeeColData(row)"
        >
          查看
        </t-link>
      </template>
    </t-table>
  </t-drawer>

  <ColOperationDialog
    ref="refColOperationDialog"
    @clickConfirm="onClickDialogConfirm"
  />
</template>

<script setup lang="ts">
import { ref, reactive, defineExpose } from "vue";
import { MessagePlugin } from "tdesign-vue-next";
import { MoveIcon } from "tdesign-icons-vue-next";
import ColOperationDialog from "./ColOperationDialog.vue";
import { addGroup } from "@/api/group";

const emits = defineEmits(["clickConfirm"]);

const visible = ref(false);
// 抽屉配置
const drawerConfig = reactive({
  // 抽屉标题
  headerTitle: "组信息",
  // 抽屉底部是否显示
  footerShow: false,
  // 抽屉类型 0 新增 1 编辑 2 查看
  drawerType: 0,
});
// 点击抽屉确认按钮
const handleClickConfirm = async () => {
  const result = await refForm.value.validate()
  if (result === true) {
    addGroup({
      groupName: formData.groupName,
      groupData: tableData.value,
    }).then(() => {
      MessagePlugin.success("保存成功");
      handleCloseDrawer()
      emits('clickConfirm')
    }).finally(() => {
    });
  }
};
// 关闭抽屉
const handleCloseDrawer = () => {
  refForm.value.reset();
  visible.value = false;
};
// 设置抽屉配置
const setDrawerConfig = (groupInfo: any) => {
  drawerConfig.drawerType = groupInfo.drawerType;
  switch (groupInfo.drawerType) {
    case 0:
      drawerConfig.headerTitle = "新增组";
      drawerConfig.footerShow = true;
      break;
    case 1:
      drawerConfig.headerTitle = "编辑组";
      drawerConfig.footerShow = true;
      break;
    case 2:
      drawerConfig.headerTitle = "查看组";
      drawerConfig.footerShow = false;
      break;
  }
  visible.value = true;
};
/**
 * @function showDrawer 显示抽屉
 * @param { Number } groupInfo.drawerType 抽屉类型 0 新增 1 编辑 2 查看
 */
const showDrawer = (groupInfo = { drawerType: 0 }) => {
  setDrawerConfig(groupInfo);
};

defineExpose({
  showDrawer,
});

// 表单相关
const refForm = ref();
// 表单数据
const formData = reactive({
  groupName: "",
});
// 表单校验规则
const formRules = reactive({
  groupName: [
    { required: true, message: "请输入组名", trigger: "blur" },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
  ],
});

// 表格相关
// 表格数据
const tableData = ref([
  {
    index: 0,
    colName: "用户名",
    colType: "text",
    colTypeText: "文本",
    colRequired: 1,
    colRequiredText: "是",
  },
  {
    index: 1,
    colName: "密码",
    colType: "encryptText",
    colTypeText: "加密文本",
    colRequired: 1,
    colRequiredText: "是",
  },
  {
    index: 2,
    colName: "备注",
    colType: "text",
    colTypeText: "文本",
    colRequired: 1,
    colRequiredText: "是",
  },
]);
// 表格列配置项
const tableColumns = ref([
  {
    colKey: "drag", // 列拖拽排序必要参数
    title: "排序",
    cell: (h: any) => h(MoveIcon),
    width: 46,
  },
  { colKey: "colName", title: "列名", align: "center" },
  { colKey: "colTypeText", title: "列类型", align: "center" },
  { colKey: "colRequiredText", title: "必填", align: "center" },
  { colKey: "operation", title: "操作", align: "center", width: 200 },
]);
// 拖拽排序
const handleDragSort = (params: any) => {
  tableData.value = params.newData;
};
// 点击修改列数据
const handleClickEditColData = (row: any, index: number) => {
  refColOperationDialog.value?.showDialog({
    ...row,
    dialogType: 2,
    rowIndex: index,
  });
};
// 点击删除列数据
const handleClickDelColData = (index: number) => {
  tableData.value.splice(index, 1);
};
// 点击查看列数据
const handleClickSeeColData = (row: any) => {
  refColOperationDialog.value?.showDialog({ ...row, dialogType: 0 });
};
// 点击新增列
const handleClickAddCol = () => {
  refColOperationDialog.value?.showDialog({
    dialogType: 1,
    rowIndex: tableData.value.length,
  });
};

// 列操作弹窗
const refColOperationDialog = ref<InstanceType<typeof ColOperationDialog>>();
// 点击列操作弹窗确认按钮
const onClickDialogConfirm = (params: any) => {
  tableData.value[params.rowIndex] = params.data;
};
</script>
