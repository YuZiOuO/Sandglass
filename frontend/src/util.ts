import { NIcon } from 'naive-ui'
import { h, type Component } from 'vue'

function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

export { renderIcon }
