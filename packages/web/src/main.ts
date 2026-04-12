import 'virtual:uno.css'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { use } from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart, LineChart } from 'echarts/charts'
import { globalQueryClient } from './services-composable/common'
import { initSentry } from './sentry'

async function bootstrap() {
  const app = createApp(App)
  initSentry(app)
  app.use(router)
  app.use(VueQueryPlugin, { queryClient: globalQueryClient })

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
