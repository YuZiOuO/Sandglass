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
          <n-button>注册</n-button>
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
import { NAutoComplete, NButton, NCard, NDivider, NFlex, NH1, NInput, useMessage } from 'naive-ui';
import { login } from '@/api/user_api.ts'
import { ref } from 'vue';
import { useLoginStatus } from '@/stores/login_status';
import router from '@/router';

const message = useMessage()

const email = ref("")
const pwd = ref("")

const login_loading = ref(false)
const signup_loading = ref(false)

const { status, reverseStatus } = useLoginStatus()

function trigger_login() {
  if (status) {
    message.error('你已登录，将跳转到首页...')
    router.push('/')
  } else {
    login_loading.value = true
    login({
      email: email.value,
      pwd: pwd.value
    }).then(
      () => {
        reverseStatus()
        message.info('登录成功')
        router.push('/')
      }
    )
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
