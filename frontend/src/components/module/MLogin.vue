<template>
    <div class="login-container">
        <n-card>
            <n-flex vertical>
                <n-flex justify="center">
                    <n-h1>
                        登录
                    </n-h1>
                    <n-auto-complete @input="handle_email_input" placeholder="邮箱" clearable />
                    <n-input @input="handle_pwd_input" type="password" show-password-on="mousedown" placeholder="密码"
                        clearable />
                    <n-button @click="login_api">登录</n-button>
                    <n-button @click="signup_api">注册</n-button>
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

<script lang="ts">
import { NAutoComplete, NButton, NCard, NDivider, NFlex, NH1, NInput } from 'naive-ui';
import { login, signup } from '@/api/user_api.ts'

export default {
    data() {
        return {
            email: "",
            pwd: ""
        }
    },
    components: {
        NCard,
        NH1,
        NAutoComplete,
        NInput,
        NFlex,
        NDivider,
        NButton,
    },
    methods: {
        login_api() {
            login({ email: this.email, pwd: this.pwd }).then((r) => console.log(r))
        },
        signup_api() {
            signup(
                {
                    auth: {
                        email: this.email,
                        pwd: this.pwd,
                    },
                    profile: {
                        avatarUrl: "",
                        nickname: "神人"
                    }
                }
            ).then((r) => console.log(r))
        },
        handle_email_input(e: string) {
            this.email = e
        },
        handle_pwd_input(p: string) {
            this.pwd = p
        }
    }
}
</script>

<style scoped>
.login-container {
    max-width: 320px;
}
</style>