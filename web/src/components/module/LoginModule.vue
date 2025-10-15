<template>
  <div class="login-container">
    <n-card>
      <n-flex vertical>
        <n-flex justify="center">
          <n-h1>
            登录
          </n-h1>
          <n-auto-complete @input="handle_email_input" placeholder="邮箱" clearable />
          <n-input @input="handle_pwd_input" type="password" show-password-on="mousedown" placeholder="密码" clearable />
          <n-button @click="trigger_login" :loading="login_loading">登录</n-button>
          <n-button @click="trigger_signup" :loading="signup_loading">注册</n-button>
        </n-flex>
        <n-divider dashed>
          第三方OAuth
        </n-divider>
        <n-flex justify="center">
          <n-button type="primary" round>
            Github
          </n-button>
          <n-button type="primary" round>
            Passkey
          </n-button>
        </n-flex>
      </n-flex>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { useAuthenticationStore } from '@/stores/authentication';
import { useUserStore } from '@/stores/user';
import { NAutoComplete, NButton, NCard, NDivider, NFlex, NH1, NInput, useMessage } from 'naive-ui';
import { ref } from 'vue';

const message = useMessage()

const email = ref("")
const pwd = ref("")

const login_loading = ref(false)
const signup_loading = ref(false)

const authenticationStore = useAuthenticationStore();
const userStore = useUserStore()

async function trigger_login() {
  try {
    await authenticationStore.login(email.value, pwd.value);
  } catch (e) {
    message.error((e as Error).message);
  }
}
async function trigger_signup() {
  try {
    await userStore.create(email.value, pwd.value);
    await authenticationStore.login(email.value, pwd.value);
  } catch (e) {
    message.error((e as Error).message);
  }
}

function handle_email_input(e: string) {
  email.value = e
}
function handle_pwd_input(p: string) {
  pwd.value = p
}
</script>

<style scoped>
.login-container {
  max-width: 320px;
}
</style>
