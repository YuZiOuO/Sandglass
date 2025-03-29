import { NIcon } from 'naive-ui'
import { h, type Component } from 'vue'

export function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

// 辅助函数, 将时间戳转换为 年-月-日 时:分:秒 格式
export function formatTimestamp(timestamp: number): number[] {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 月份从 0 开始，需要 +1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return [year, month, day, hours, minutes, seconds]
}

export function formatTimestampString(timestamp: number): string {
  const result = formatTimestamp(timestamp)
  return `${result[0]}-${result[1]}-${result[2]} ${result[3]}:${result[4]}:${result[5]}`
}

// 判断给定时间戳是否在给定日期内
export function inGivenDate(timestamp: number, year: number, month: number, date: number): boolean {
  const t = formatTimestamp(timestamp)
  return t[0] === year && t[1] === month && t[2] === date
}
