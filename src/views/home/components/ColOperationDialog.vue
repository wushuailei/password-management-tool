<template>
  <t-dialog
    v-model:visible="visible"
    :header="dialogConfig.headerTitle"
    :footer="dialogConfig.footerShow"
    :closeOnOverlayClick="false"
    @close="handleCloseDialog"
    @confirm="handleClickConfirm"
  >
    <t-form ref="refForm" :rules="formRules" :data="formData" :colon="true">
      <t-form-item label="列名" name="colName">
        <t-input
          :disabled="!dialogConfig.footerShow"
          v-model="formData.colName"
          placeholder="请输入列名"
        ></t-input>
      </t-form-item>
      <t-form-item label="类型" name="colType">
        <t-select
          :disabled="!dialogConfig.footerShow"
          v-model="formData.colType"
          clearable
        >
          <t-option
            v-for="(val, key) in EnumColType"
            :key="key"
            :value="key"
            :label="val"
          ></t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="必填" name="colRequired">
        <t-radio-group
          :disabled="!dialogConfig.footerShow"
          v-model="formData.colRequired"
        >
          <t-radio :value="1">是</t-radio>
          <t-radio :value="0">否</t-radio>
        </t-radio-group>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, defineExpose, defineEmits } from "vue";
import EnumColType from "../../../enums/colType.enum.ts";

const emits = defineEmits(["clickConfirm"]);

const visible = ref(false);
const dialogConfig = {
  headerTitle: "",
  dialogType: 0, // 0 查看 1 新增 2 编辑
  footerShow: false,
  rowIndex: null
};
const setDialogConfig = (colInfo: any) => {
  dialogConfig.dialogType = colInfo.dialogType;
  dialogConfig.rowIndex = typeof colInfo.rowIndex === "number" ? colInfo.rowIndex : null;
  switch (colInfo.dialogType) {
    case 0:
      dialogConfig.headerTitle = "查看";
      dialogConfig.footerShow = false;
      setFormData(colInfo);
      break;
    case 1:
      dialogConfig.headerTitle = "新增";
      dialogConfig.footerShow = true;
      setFormData({
        colName: "",
        colRequired: 1,
        colType: "text",
      });
      break;
    case 2:
      dialogConfig.headerTitle = "编辑";
      dialogConfig.footerShow = true;
      setFormData(colInfo);
      break;
  }
};
const showDialog = (colInfo: any) => {
  setDialogConfig(colInfo);
  visible.value = true;
};
const handleCloseDialog = () => {
  refForm.value.reset();
  visible.value = false;
};
const handleClickConfirm = async () => {
  const result = await refForm.value.validate();
  if (result === true) {
    const data = {
      colName: formData.colName,
      colRequired: formData.colRequired,
      colRequiredText: formData.colRequired ? "是" : "否",
      colType: formData.colType,
      colTypeText: EnumColType[formData.colType as keyof typeof EnumColType],
      index: new Date().getTime()
    };
    emits("clickConfirm", { data, dialogType: dialogConfig.dialogType, rowIndex: dialogConfig.rowIndex });
    handleCloseDialog();
  }
};
defineExpose({
  showDialog,
});

// 表单相关
const refForm = ref();
// 表单数据
const formData = reactive({
  colName: "",
  colRequired: 1,
  colType: "text",
});
// 表单校验规则
const formRules = reactive({
  colName: [
    { required: true, message: "请输入列名", trigger: "blur" },
    { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
  ],
  colType: [{ required: true, message: "请选择列类型", trigger: "change" }],
  colRequired: [
    { required: true, message: "请选择是否必填", trigger: "change" },
  ],
});
// 设置表单数据
const setFormData = (colInfo: any) => {
  formData.colName = colInfo.colName;
  formData.colRequired = colInfo.colRequired;
  formData.colType = colInfo.colType;
};
</script>
<style lang=""></style>
