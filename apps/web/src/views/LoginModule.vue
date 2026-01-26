<template>
  <div class="login-container">
    <n-card>
      <n-flex vertical>
        <n-flex justify="center">
          <n-h1> 登录 </n-h1>
          <n-auto-complete
            @input="
              (input: string) => {
                email = input
              }
            "
            placeholder="邮箱"
            clearable
          />
          <n-input
            @input="
              (input: string) => {
                password = input
              }
            "
            type="password"
            show-password-on="mousedown"
            placeholder="密码"
            clearable
          />
          <n-button @click="trigger_login" :loading="loginLoading" :disabled="signupLoading"
            >登录</n-button
          >
          <n-button @click="trigger_signup" :loading="signupLoading" :disabled="loginLoading"
            >注册</n-button
          >
        </n-flex>
        <n-divider dashed> 第三方OAuth </n-divider>
        <n-flex justify="center">
          <n-button type="primary" round> Github </n-button>
          <n-button type="primary" round> Passkey </n-button>
        </n-flex>
      </n-flex>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useSignup } from '@/services-composable/user'
import { useAuthenticationStore } from '@/stores/authentication'
import { NAutoComplete, NButton, NCard, NDivider, NFlex, NH1, NInput, useMessage } from 'naive-ui'
import { ref } from 'vue'

const emit = defineEmits(['login-success'])

const message = useMessage()

const email = ref('')
const password = ref('')
const loginLoading = ref(false)
const signupLoading = ref(false)

const authenticationStore = useAuthenticationStore()
const signup = useSignup()

async function trigger_login() {
  loginLoading.value = true
  try {
    await authenticationStore.login(email.value, password.value)
    emit('login-success')
  } catch (e) {
    message.error((e as Error).message)
  }
  loginLoading.value = false
}
async function trigger_signup() {
  signupLoading.value = true
  try {
    await signup.mutateAsync({ email: email.value, password: password.value })
  } catch (e) {
    message.error((e as Error).message)
  }
  signupLoading.value = false
}
</script>

<style scoped>
.login-container {
  max-width: 85%;
}
</style>
