<template>
  <div class="login-container">
    <n-card>
      <n-flex vertical>
        <n-flex justify="center">
          <n-h1> 登录 </n-h1>
          <n-auto-complete v-model:value="form.email" placeholder="邮箱" clearable />
          <n-input
            v-model:value="form.password"
            type="password"
            show-password-on="mousedown"
            placeholder="密码"
            clearable
          />
          <n-button
            @click="
              async () => {
                const res = await signIn.mutateAsync({ ...form })
                handleLogin(res.error?.message)
              }
            "
            :loading="signIn.isPending.value"
            :disabled="signIn.isPending.value"
            >登录</n-button
          >
          <n-button
            @click="
              async () => {
                const res = await signUp.mutateAsync({ ...form, name: 'test' })
                if (!res.error) {
                  message.success('注册成功，请继续登录')
                } else {
                  message.error('注册失败: ' + res.error.message)
                }
              }
            "
            :loading="signUp.isPending.value"
            :disabled="signUp.isPending.value"
            >注册</n-button
          >
        </n-flex>
        <n-divider dashed> 第三方OAuth </n-divider>
        <n-flex justify="center">
          <n-button
            type="primary"
            round
            @click="
              async () => {
                const res = await githubSignIn.mutateAsync()
                handleLogin(res.error?.message)
              }
            "
            :loading="githubSignIn.isPending.value"
          >
            Github
          </n-button>
          <n-button
            type="primary"
            round
            @click="
              async () => {
                const res = await googleSignIn.mutateAsync()
                handleLogin(res.error?.message)
              }
            "
            :loading="googleSignIn.isPending.value"
          >
            Google
          </n-button>
          <n-button
            type="primary"
            round
            @click="
              async () => {
                const res = await passkeySignIn.mutateAsync()
                handleLogin(res.error?.message)
              }
            "
            :loading="passkeySignIn.isPending.value"
          >
            Passkey
          </n-button>
        </n-flex>
      </n-flex>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import {
  usePasskeySignInMutate,
  useSignInMutate,
  useSignUpMutate,
  useSocialSignInMutate,
} from '@/services-composable/user'
import { NAutoComplete, NButton, NCard, NDivider, NFlex, NH1, NInput, useMessage } from 'naive-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const form = ref<{ email: string; password: string }>({
  email: '',
  password: '',
})

const router = useRouter()
const message = useMessage()

const signIn = useSignInMutate()
const passkeySignIn = usePasskeySignInMutate()
const githubSignIn = useSocialSignInMutate('github')
const googleSignIn = useSocialSignInMutate('google')
const signUp = useSignUpMutate()

function handleLogin(err?: string) {
  if (!err) {
    message.success('登录成功，正在跳转...')
    router.push('/')
  } else {
    message.error('登录失败: ' + err)
  }
}
</script>

<style scoped>
.login-container {
  max-width: 85%;
}
</style>
