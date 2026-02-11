import { createApp } from 'vue'

import App from './App.vue'
import pinia from './stores'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { initializeFirebase } from './services-composable/firebase'
import { globalQueryClient } from './services-composable'
import { use } from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart } from 'echarts/charts'

async function bootstrap() {
  const app = createApp(App)
  app.use(pinia)
  app.use(router)
  app.use(VueQueryPlugin, { queryClient: globalQueryClient })

  await initializeFirebase()

  use([
    CanvasRenderer,

    PieChart,
    BarChart,
    LineChart,

    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
  ])

  app.mount('#app')
}

bootstrap()
