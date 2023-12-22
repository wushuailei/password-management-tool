<template>
  <div class="login">
    <div class="alert-box" v-if="isShowAlert">
      <t-alert theme="info" message="初始账号为admin 初始密码为123456 请进入后及时修改" />
    </div>
    <div class="login_form_box">
      <div class="title">密码管理</div>
      <t-form ref="form" :data="formData"  :rules="formRules" :colon="true" :label-width="0" @reset="onReset" @submit="onSubmit">
        <t-form-item name="username">
          <t-input v-model="formData.username" clearable placeholder="请输入用户名">
            <template #prefix-icon>
              <desktop-icon />
            </template>
          </t-input>
        </t-form-item>
        <t-form-item name="password">
          <t-input v-model="formData.password" type="password" clearable placeholder="请输入密码">
            <template #prefix-icon>
              <lock-on-icon />
            </template>
          </t-input>
        </t-form-item>
        <t-form-item>
          <t-space style="width: 100%;" size="small">
            <t-button theme="primary" type="submit" block>登录</t-button>
            <t-button theme="default" type="reset" block>重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-vue-next';
import { checkUserExist, login } from '@/api/user';
import { useUserStore } from '@/store/user.ts'
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useUserStore()

// 是否显示提示
const isShowAlert = ref(false);
const isShowAlertFn = () => {
  checkUserExist().then((res: any) => {
    if (!res.data) {
      isShowAlert.value = true;
    }
  });
};

isShowAlertFn()

// 表单验证规则
const formRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
})
// 表单数据
const formData = reactive({
  username: '',
  password: '',
});

const onReset = () => {
  MessagePlugin.success('重置成功');
};

const onSubmit = ({ validateResult, firstError }: any) => {
  if (validateResult === true) {
    login(formData).then((res: any) => {
      userStore.setUserInfo(res.data)
      MessagePlugin.success('登录成功');
      router.push('/')
    });
  } else {
    MessagePlugin.warning(firstError);
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .alert-box {
    position: fixed;
    top: 10px;
    width: 100%;
  }
  .login_form_box {
    position: relative;
    top: -100px;
    .title {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20px;
    }
    width: 400px;
  }
}
</style>