<template>
    <div class="login-container">
        <n-card>
            <n-flex vertical>
                <n-flex justify="center">
                    <n-h1>
                        登录
                    </n-h1>
                    <n-auto-complete placeholder="邮箱" clearable />
                    <n-input type="password" show-password-on="mousedown" placeholder="密码" clearable />
                    <n-button>登录</n-button>
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

<script lang="ts">
import { NAutoComplete, NButton, NCard, NDivider, NFlex, NH1, NInput } from 'naive-ui';

export default {
    components: {
        NCard,
        NH1,
        NAutoComplete,
        NInput,
        NFlex,
        NDivider,
        NButton,
    }
}
</script>

<style scoped>
.login-container {
    max-width: 320px;
}
</style>