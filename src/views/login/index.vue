<template>
  <div class="login-content">
    <div class="login-content-form">
      <div class="login-content-title">杂念屋</div>
      <div>
        <el-form :model="formData" :rules="rules" ref="login" label-width="0px" class="ms-content">
          <el-form-item prop="username">
            <el-input v-model="formData.username" size="small" placeholder="username">
              <template #prepend>
                <el-button :icon="User"></el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="password"
              v-model="formData.password"
              @keyup.enter="submitForm(login)"
              size="small"
            >
              <template #prepend>
                <el-button :icon="Lock"></el-button>
              </template>
            </el-input>
          </el-form-item>
          <div class="login-btn">
            <el-button type="primary" @click="submitForm(login)">登录</el-button>
          </div>
          <p class="login-tips">Tips : 用户名和密码随便填。</p>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import { judgeForm } from '../../utils/form';
interface LoginInfo {
  username: string;
  password: string;
}

const router = useRouter();
const formData = reactive<LoginInfo>({
  username: 'admin',
  password: '123123',
});

const rules: FormRules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const login = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
  if (judgeForm(formEl)) {
    ElMessage.success('登录成功');
    localStorage.setItem('ms_username', formData.username);
    localStorage.setItem('ms_keys', '');
    router.push('/');
  } else {
    ElMessage.error('登录失败');
    return false;
  }
};
</script>

<style scoped lang="scss">
.login-content {
  .login-content-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    border-bottom: 1px solid #ddd;
  }
  .login-content-form {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
  }
}
</style>
