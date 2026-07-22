<script lang="ts">
export type DashboardState = {
  items: {
    id: string
    x: number
    y: number
    w: number
    h: number
  }[]
}

export type ConnectionStatus = 'checking' | 'ready' | 'partial' | 'error'
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'conflict' | 'error'

export const createDefaultDashboardState = (): DashboardState => ({
  items: [
    { id: 'attendance', x: 0, y: 0, w: 4, h: 8 },
    { id: 'project', x: 4, y: 0, w: 8, h: 8 },
  ],
})
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import {
  NButton,
  NBadge,
  NCard,
  NDrawer,
  NDrawerContent,
  NEllipsis,
  NEmpty,
  NFlex,
  NIcon,
  NList,
  NListItem,
  NScrollbar,
  NTabPane,
  NTabs,
  NThing,
  NTooltip,
} from 'naive-ui'
import {
  AddOutline,
  CheckmarkOutline,
  ChevronDownOutline,
  ChevronUpOutline,
  CloudDoneOutline,
  CloudOfflineOutline,
  CloudOutline,
  CloseOutline,
  GridOutline,
  HourglassOutline,
  LinkOutline,
  RefreshOutline,
  ReorderFourOutline,
  SettingsOutline,
} from '@vicons/ionicons5'
import type { GridStack as GridStackInstance, GridStackNode } from 'gridstack'
import {
  GridStack as GridStackView,
  GridStackItem,
  type GridStackOptions,
  type GridStackWidget,
} from 'gridstack/dist/vue'
import 'gridstack/dist/gridstack.min.css'

import type { StatePort } from '@/interfaces'
import type { PluginRuntime } from '@/lib'

const props = defineProps<{
  plugins: readonly PluginRuntime[]
  state: StatePort<DashboardState>
  connectionStatus: ConnectionStatus
  syncStatus: SyncStatus
}>()

const gridRef = shallowRef<{ getGrid: () => GridStackInstance | null }>()
const items = ref<DashboardState['items']>([])
const editSnapshot = ref<DashboardState['items']>([])
const editing = ref(false)
const pluginDrawerVisible = ref(false)
const settingsVisible = ref(false)
const settingsTab = ref<'connections' | 'sync'>('connections')
const now = ref(new Date())
const isMobile = ref(false)
let clock: number | undefined
let media: MediaQueryList | undefined
let updateMobile: (() => void) | undefined

const pluginsById = computed(() => new Map(props.plugins.map((plugin) => [plugin.id, plugin])))
const visibleItems = computed(() => items.value.filter(({ id }) => pluginsById.value.has(id)))
const availableToAdd = computed(() =>
  props.plugins.filter((plugin) => !items.value.some(({ id }) => id === plugin.id)),
)
const gridOptions = computed<GridStackOptions>(() => ({
  column: isMobile.value ? 1 : 12,
  cellHeight: 56,
  margin: 12,
  animate: !globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  staticGrid: !editing.value,
  disableResize: !editing.value || isMobile.value,
  disableDrag: !editing.value,
  handle: '.dashboard-panel__drag-handle',
  draggable: {
    cancel: 'input,textarea,button,select,option,a,.n-base-selection,.n-tabs-nav',
    scroll: true,
  },
  resizable: { handles: 'se', autoHide: false },
  sizeToContent: isMobile.value,
  float: false,
}))
const formattedDate = computed(() =>
  now.value.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }),
)
const formattedTime = computed(() =>
  now.value.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
)
const connectionMeta = computed(() => {
  const values = {
    checking: { label: '检查连接', color: '#909399' },
    ready: { label: '连接正常', color: '#18a058' },
    partial: { label: '部分连接', color: '#f0a020' },
    error: { label: '连接异常', color: '#d03050' },
  }
  return values[props.connectionStatus]
})
const syncMeta = computed(() => {
  const values = {
    idle: { label: '尚未同步', color: '#909399', icon: CloudOutline, processing: false },
    syncing: { label: '同步中', color: '#2080f0', icon: RefreshOutline, processing: true },
    synced: { label: '已同步', color: '#18a058', icon: CloudDoneOutline, processing: false },
    conflict: { label: '同步冲突', color: '#f0a020', icon: CloudOfflineOutline, processing: false },
    error: { label: '同步异常', color: '#d03050', icon: CloudOfflineOutline, processing: false },
  }
  return values[props.syncStatus]
})

function cloneItems(value: readonly DashboardState['items'][number][]) {
  return value.map((item) => ({ ...item }))
}

function widgetOptions(item: DashboardState['items'][number], index: number): GridStackWidget {
  const profile = pluginsById.value.get(item.id)?.profile
  return {
    id: item.id,
    ...(isMobile.value
      ? { x: 0, y: index, w: 1, h: item.h, minW: 1, minH: 1, sizeToContent: true }
      : {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          minW: profile?.layout.minW,
          minH: profile?.layout.minH,
        }),
    noMove: !editing.value,
    noResize: !editing.value || isMobile.value,
  }
}

async function loadGrid() {
  await nextTick()
  const grid = gridRef.value?.getGrid()
  if (!grid) return

  grid.load(visibleItems.value.map((item, index) => widgetOptions(item, index)))
  grid.setStatic(!editing.value)
  grid.enableMove(editing.value)
  grid.enableResize(editing.value && !isMobile.value)
}

function updateFromNodes(_event: Event, nodes: GridStackNode[]) {
  if (!editing.value) return

  if (isMobile.value) {
    const order = new Map(
      [...nodes]
        .sort((left, right) => (left.y ?? 0) - (right.y ?? 0))
        .map((node, index) => [String(node.id), index]),
    )
    items.value = [...items.value].sort(
      (left, right) =>
        (order.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
        (order.get(right.id) ?? Number.MAX_SAFE_INTEGER),
    )
    return
  }

  const positions = new Map(nodes.map((node) => [String(node.id), node]))
  items.value = items.value.map((item) => {
    const node = positions.get(item.id)
    return node
      ? {
          ...item,
          x: node.x ?? item.x,
          y: node.y ?? item.y,
          w: node.w ?? item.w,
          h: node.h ?? item.h,
        }
      : item
  })
}

function startEditing() {
  editSnapshot.value = cloneItems(items.value)
  editing.value = true
}

function finishEditing() {
  props.state.write({ items: cloneItems(items.value) })
  editing.value = false
  pluginDrawerVisible.value = false
}

function cancelEditing() {
  items.value = cloneItems(editSnapshot.value)
  editing.value = false
  pluginDrawerVisible.value = false
  void loadGrid()
}

function resetLayout() {
  items.value = cloneItems(createDefaultDashboardState().items)
  void loadGrid()
}

function addPlugin(plugin: PluginRuntime) {
  if (!plugin.available()) return
  const y = items.value.reduce((bottom, item) => Math.max(bottom, item.y + item.h), 0)
  items.value = [
    ...items.value,
    {
      id: plugin.id,
      x: 0,
      y,
      w: plugin.profile.layout.w,
      h: plugin.profile.layout.h,
    },
  ]
}

function removePlugin(id: string) {
  items.value = items.value.filter((item) => item.id !== id)
}

function movePlugin(id: string, direction: -1 | 1) {
  const index = items.value.findIndex((item) => item.id === id)
  const target = index + direction
  if (index < 0 || target < 0 || target >= items.value.length) return

  if (isMobile.value) {
    const next = [...items.value]
    ;[next[index], next[target]] = [next[target]!, next[index]!]
    items.value = next
  } else {
    items.value = items.value.map((item) =>
      item.id === id ? { ...item, y: Math.max(0, item.y + direction) } : item,
    )
  }
  void loadGrid()
}

function openSettings(tab: 'connections' | 'sync') {
  settingsTab.value = tab
  settingsVisible.value = true
}

watch(
  () => props.state.read(),
  (value) => {
    if (editing.value) return
    items.value = cloneItems(value.items.length ? value.items : createDefaultDashboardState().items)
    void loadGrid()
  },
  { immediate: true },
)

watch([editing, isMobile], () => void loadGrid())

onMounted(() => {
  clock = window.setInterval(() => {
    now.value = new Date()
  }, 30_000)
  media = window.matchMedia('(max-width: 767px)')
  updateMobile = () => {
    isMobile.value = media?.matches ?? false
  }
  media.addEventListener('change', updateMobile)
  updateMobile()
})

onBeforeUnmount(() => {
  if (clock !== undefined) window.clearInterval(clock)
  if (media && updateMobile) media.removeEventListener('change', updateMobile)
})
</script>

<template>
  <div class="dashboard-shell" :class="{ 'dashboard-shell--editing': editing }">
    <header class="dashboard-header">
      <div class="dashboard-brand">
        <n-icon :size="25" color="#18a058"><HourglassOutline /></n-icon>
        <div>
          <strong>Sandglass</strong>
          <span>{{ formattedDate }} · {{ formattedTime }}</span>
        </div>
      </div>

      <n-flex align="center" :wrap="false" :size="8">
        <n-button quaternary class="status-button" @click="openSettings('connections')">
          <template #icon>
            <n-badge dot :show="connectionStatus !== 'ready'" :color="connectionMeta.color">
              <n-icon><LinkOutline /></n-icon>
            </n-badge>
          </template>
          <span class="status-label">{{ connectionMeta.label }}</span>
        </n-button>
        <n-button quaternary class="status-button" @click="openSettings('sync')">
          <template #icon>
            <n-badge
              dot
              :show="syncStatus !== 'synced'"
              :color="syncMeta.color"
              :processing="syncMeta.processing"
            >
              <n-icon><component :is="syncMeta.icon" /></n-icon>
            </n-badge>
          </template>
          <span class="status-label">{{ syncMeta.label }}</span>
        </n-button>

        <template v-if="editing">
          <n-tooltip>
            <template #trigger>
              <n-button quaternary circle aria-label="恢复默认布局" @click="resetLayout">
                <template #icon
                  ><n-icon><RefreshOutline /></n-icon
                ></template>
              </n-button>
            </template>
            恢复默认布局
          </n-tooltip>
          <n-button secondary @click="cancelEditing">取消</n-button>
          <n-button type="primary" @click="finishEditing">
            <template #icon
              ><n-icon><CheckmarkOutline /></n-icon
            ></template>
            完成
          </n-button>
        </template>
        <n-button v-else type="primary" secondary @click="startEditing">
          <template #icon
            ><n-icon><GridOutline /></n-icon
          ></template>
          定制
        </n-button>
        <n-tooltip>
          <template #trigger>
            <n-button circle quaternary aria-label="打开设置" @click="openSettings('connections')">
              <template #icon
                ><n-icon><SettingsOutline /></n-icon
              ></template>
            </n-button>
          </template>
          设置
        </n-tooltip>
      </n-flex>
    </header>

    <main class="dashboard-canvas">
      <div v-if="editing" class="edit-toolbar">
        <span>拖动标题栏调整位置，拖动右下角调整大小。</span>
        <n-button size="small" @click="pluginDrawerVisible = true">
          <template #icon
            ><n-icon><AddOutline /></n-icon
          ></template>
          添加插件
        </n-button>
      </div>

      <GridStackView ref="gridRef" :options="gridOptions" @change="updateFromNodes">
        <GridStackItem
          v-for="(item, index) in visibleItems"
          :id="item.id"
          :key="item.id"
          :options="widgetOptions(item, index)"
        >
          <n-card
            v-if="pluginsById.get(item.id)"
            size="small"
            class="dashboard-panel"
            content-style="height: 100%; min-height: 0;"
          >
            <template #header>
              <n-flex
                align="center"
                :wrap="false"
                :size="8"
                class="dashboard-panel__title dashboard-panel__drag-handle"
              >
                <n-icon :size="18">
                  <component :is="pluginsById.get(item.id)!.profile.icon" />
                </n-icon>
                <n-ellipsis>{{ pluginsById.get(item.id)!.profile.title }}</n-ellipsis>
                <n-icon v-if="editing" class="dashboard-panel__grip"><ReorderFourOutline /></n-icon>
              </n-flex>
            </template>
            <template v-if="editing" #header-extra>
              <n-flex :wrap="false" :size="2">
                <n-button
                  quaternary
                  circle
                  size="tiny"
                  aria-label="向前移动"
                  @click="movePlugin(item.id, -1)"
                >
                  <template #icon
                    ><n-icon><ChevronUpOutline /></n-icon
                  ></template>
                </n-button>
                <n-button
                  quaternary
                  circle
                  size="tiny"
                  aria-label="向后移动"
                  @click="movePlugin(item.id, 1)"
                >
                  <template #icon
                    ><n-icon><ChevronDownOutline /></n-icon
                  ></template>
                </n-button>
                <n-button
                  quaternary
                  circle
                  size="tiny"
                  type="error"
                  aria-label="移出工作台"
                  @click="removePlugin(item.id)"
                >
                  <template #icon
                    ><n-icon><CloseOutline /></n-icon
                  ></template>
                </n-button>
              </n-flex>
            </template>

            <n-scrollbar style="height: 100%">
              <component
                v-if="pluginsById.get(item.id)!.available()"
                :is="pluginsById.get(item.id)!.component"
              />
              <n-empty
                v-else
                :description="pluginsById.get(item.id)!.unavailableText ?? '当前插件不可用。'"
              >
                <template #extra>
                  <n-button size="small" @click="openSettings('connections')"
                    >打开连接设置</n-button
                  >
                </template>
              </n-empty>
            </n-scrollbar>
          </n-card>
        </GridStackItem>

        <template #empty>
          <n-empty description="工作台还是空的。">
            <template #extra>
              <n-button type="primary" @click="pluginDrawerVisible = true">添加插件</n-button>
            </template>
          </n-empty>
        </template>
      </GridStackView>
    </main>

    <n-drawer v-model:show="pluginDrawerVisible" :width="360">
      <n-drawer-content title="插件库" closable>
        <n-list v-if="availableToAdd.length" hoverable>
          <n-list-item v-for="plugin in availableToAdd" :key="plugin.id">
            <n-thing :title="plugin.profile.title">
              <template #avatar>
                <n-icon :size="22"><component :is="plugin.profile.icon" /></n-icon>
              </template>
              <template #description>
                {{ plugin.available() ? '可添加到工作台' : plugin.unavailableText }}
              </template>
              <template #header-extra>
                <n-button size="small" :disabled="!plugin.available()" @click="addPlugin(plugin)">
                  添加
                </n-button>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
        <n-empty v-else description="所有插件都已添加。" />
      </n-drawer-content>
    </n-drawer>

    <n-drawer v-model:show="settingsVisible" display-directive="show" :width="520">
      <n-drawer-content title="设置" closable>
        <n-tabs v-model:value="settingsTab" type="line" animated>
          <n-tab-pane name="connections" tab="连接">
            <slot name="connections" />
          </n-tab-pane>
          <n-tab-pane name="sync" tab="同步">
            <slot name="sync" />
          </n-tab-pane>
        </n-tabs>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style scoped>
.dashboard-shell {
  min-height: 100vh;
  color: #1f2328;
  background: #f5f7f9;
}

.dashboard-header {
  position: sticky;
  z-index: 20;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  padding: 0 28px;
  border-bottom: 1px solid #e5e7eb;
  background: rgb(255 255 255 / 96%);
}

.dashboard-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.dashboard-brand > div {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dashboard-brand strong {
  font-size: 17px;
  line-height: 1.2;
}

.dashboard-brand span {
  overflow: hidden;
  color: #667085;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-canvas {
  max-width: 1360px;
  min-height: calc(100vh - 64px);
  margin: 0 auto;
  padding: 20px 16px 48px;
}

.edit-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 42px;
  margin: 0 6px 8px;
  color: #667085;
  font-size: 13px;
}

.dashboard-panel {
  height: 100%;
}

.dashboard-panel__grip {
  color: #98a2b3;
}

.dashboard-shell--editing .dashboard-panel__drag-handle {
  cursor: grab;
}

.dashboard-shell--editing .dashboard-panel__drag-handle:active {
  cursor: grabbing;
}

.status-button {
  padding-inline: 8px;
}

:deep(.grid-stack) {
  min-height: 120px;
}

:deep(.grid-stack-item-content) {
  overflow: hidden;
}

:deep(.dashboard-panel > .n-card-header) {
  min-height: 45px;
  padding: 10px 14px;
}

:deep(.dashboard-panel > .n-card__content) {
  padding: 14px;
}

@media (max-width: 767px) {
  .dashboard-header {
    min-height: 58px;
    padding: 0 14px;
  }

  .dashboard-brand span,
  .status-label,
  .edit-toolbar span {
    display: none;
  }

  .dashboard-canvas {
    min-height: calc(100vh - 58px);
    padding: 12px 6px 32px;
  }

  .edit-toolbar {
    justify-content: flex-end;
    margin-inline: 6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  :deep(.grid-stack-item) {
    transition: none !important;
  }
}
</style>
