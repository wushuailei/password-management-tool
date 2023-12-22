<template>
  <t-drawer
    v-model:visible="visible"
    :header="drawerConfig.headerTitle"
    :on-confirm="handleClickConfirm"
    :closeOnOverlayClick="false"
    :close-btn="true"
    @close="handleCloseDrawer"
    size="70%"
  >
    <t-form ref="refForm" :rules="formRules" :data="formData" :colon="true">
      <t-form-item
        v-for="formItem in groupInfo.groupData"
        :key="formItem.index"
        :label="formItem.colName"
        :name="formItem.index"
      >
        <t-input
          v-model="formData[formItem.index]"
          :placeholder="'请输入' + formItem.colName"
        ></t-input>
      </t-form-item>
    </t-form>
  </t-drawer>
</template>
<script lang="ts" setup>
import { ref, reactive, inject, defineExpose, defineEmits } from "vue";
import EnumDrawerType from "@/enums/drawerType.enum.ts";
import { addTextItem, editTextItem } from "@/api/textItem";
import { MessagePlugin } from "tdesign-vue-next";

const emits = defineEmits(["clickConfirm"]);

const groupInfo: any = inject("groupInfo");

const visible = ref(false);
const drawerConfig = reactive({
  headerTitle: "新增数据",
  // 抽屉底部是否显示
  footerShow: false,
  // 抽屉类型 0 查看 1 新增 2 编辑
  drawerType: 0,
});
// 设置抽屉配置
const setDrawerConfig = (item: any) => {
  drawerConfig.drawerType = item.drawerType;
  drawerConfig.headerTitle = `${EnumDrawerType[item.drawerType]}数据`;
  drawerConfig.footerShow = item.drawerType !== 0;
  if (item.drawerType === 2) {
    formData.value._id = item._id;
  }
};
// 打开抽屉
const showDrawer = (item: any) => {
  generateForm(item);
  setDrawerConfig(item);
  visible.value = true;
};
defineExpose({
  showDrawer,
});
// 生成表单
const generateForm = (textItem: any = {}) => {
  for (const iterator of groupInfo.value.groupData) {
    formData.value[iterator.index] = textItem[iterator.index] || "";
    formRules.value[iterator.index] = [
      { required: iterator.colRequired, message: "请输入" + iterator.colName, trigger: "blur" },
    ];
  }
};
// 点击确认
const handleClickConfirm = async () => {
  const result = await refForm.value.validate();
  if (result === true) {
    const params = groupInfo.value.groupData.map((item: any) => {
      return {
        key: item.index,
        val: formData.value[item.index],
        colType: item.colType,
      };
    });
    if (drawerConfig.drawerType === 1) {
      await addTextItem({ params, groupId: groupInfo.value._id });
    } else {
      await editTextItem({
        params,
        groupId: groupInfo.value._id,
        _id: formData.value._id,
      });
    }
    MessagePlugin.success("操作成功");
    handleCloseDrawer();
    emits("clickConfirm");
  }
};
// 关闭抽屉
const handleCloseDrawer = () => {
  refForm.value.reset();
  formRules.value = {};
  formData.value = {};
  visible.value = false;
};

// 表单ref
const refForm = ref<any>(null);
// 表单校验规则
const formRules = ref(<any>{});
// 表单数据
const formData = ref(<any>{});
</script>
<style lang=""></style>
