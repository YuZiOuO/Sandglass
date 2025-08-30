// 引入热力图插件css
import 'vue3-calendar-heatmap/dist/style.css'

import { createApp } from 'vue'

import App from './App.vue'
import pinia from './stores'
import router from './router'

const app = createApp(App)
app.use(pinia)
app.use(router)

app.mount('#app')
