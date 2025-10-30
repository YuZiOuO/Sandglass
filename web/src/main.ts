import { createApp } from 'vue'

import App from './App.vue'
import pinia from './stores'
import router from './router'
import { checkEnvsDefinedAndNotEmpty } from '../env/env'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { initializeFirebase } from './services-composable/firebase'
import { globalQueryClient } from './services-composable'

checkEnvsDefinedAndNotEmpty()

await initializeFirebase()
console.log('Firebase Initialized.')

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, { queryClient: globalQueryClient })

app.mount('#app')
