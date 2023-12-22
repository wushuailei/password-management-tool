<template>
  <div class="user">
    <div class="form-box">
      <t-form
        ref="form"
        :rules="formRules"
        :data="formData"
        :colon="true"
        @submit="onSubmit"
      >
        <t-form-item label="用户名" name="username">
          <t-input
            v-model="formData.username"
            clearable
            placeholder="请输入内容"
          >
          </t-input>
        </t-form-item>

        <t-form-item label="密码" name="password">
          <t-input
            v-model="formData.password"
            type="password"
            clearable
            placeholder="请输入密码"
          >
          </t-input>
        </t-form-item>

        <t-form-item label="修改时间">
          <t-input v-model="updatedAt" disabled> </t-input>
        </t-form-item>

        <t-form-item label="创建时间">
          <t-input v-model="createdAt" disabled> </t-input>
        </t-form-item>

        <t-form-item>
          <t-space size="small">
            <t-button theme="primary" type="submit">保存修改</t-button>
            <t-button theme="default" variant="base" type="reset"
              >清空</t-button
            >
            <t-button theme="default" variant="base" @click="handleClickRestore"
              >恢复清空</t-button
            >
          </t-space>
        </t-form-item>
      </t-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user.ts";
import { queryUserInfo, updateUserInfo } from "@/api/user.ts";
import dayjs from 'dayjs';
import { MessagePlugin } from "tdesign-vue-next";

const router = useRouter();

const userStore = useUserStore();
const userInfo: any = computed(() => userStore.userInfo || {});

// 表单验证规则
const formRules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
});
// 表单数据
const formData = reactive({
  username: "",
  password: "",
});
// 创建时间
const createdAt = ref("");
// 修改时间
const updatedAt = ref("");

// 点击恢复清空
const handleClickRestore = () => {
  formData.username = userInfo.value.username;
};

const onSubmit = ({ validateResult, firstError }: any) => {
  if (validateResult === true) {
    updateUserInfo({ ...formData, _id: userInfo.value._id }).then(
      () => {
        MessagePlugin.success("修改成功，请重新登录！");
        userStore.logout();
        router.push("/login");
      }
    );
  } else {
    MessagePlugin.warning(firstError);
  }
};

// 获取用户信息
function getUserInfo() {
  queryUserInfo(userInfo.value._id).then((res: any) => {
    userStore.setUserInfo(res.data);
    formData.username = userInfo.value.username;
    createdAt.value = dayjs(userInfo.value.createdAt).format('YYYY-MM-DD HH:mm:ss');
    updatedAt.value = dayjs(userInfo.value.updatedAt).format('YYYY-MM-DD HH:mm:ss');
  });
}

getUserInfo();
</script>
<style lang="less" scoped>
.user {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  margin: 20px;
  background-color: #fff;
  border-radius: 6px;
  .form-box {
    width: 50%;
    padding: 20px;
  }
}
</style>
