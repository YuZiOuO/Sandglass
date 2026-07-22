<script lang="ts">
import type { CalendarCapability } from '@/capability/calendar'
import type { RepoCapability } from '@/capability/repo'
import type { TaskCapability } from '@/capability/task'
import type { MutableScoped } from '@/interfaces'

export type Project = {
  name: string
  bindings: {
    repo?: string
    calendar?: string
    task?: string
  }
}

export type ProjectState = {
  projects: Project[]
  selectedProjectName?: string
}

export type ProjectCapabilities = {
  repo?: RepoCapability
  repositories?: MutableScoped<RepoCapability, { name: string; private: boolean }>
  calendars?: MutableScoped<CalendarCapability>
  tasks?: MutableScoped<TaskCapability>
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
  NCheckbox,
  NEmpty,
  NFlex,
  NFormItem,
  NIcon,
  NInput,
  NInputGroup,
  NList,
  NListItem,
  NModal,
  NPopconfirm,
  NSelect,
  NSpace,
  NSpin,
  NTabPane,
  NTabs,
  NThing,
  NTimeline,
  NTimelineItem,
} from 'naive-ui'
import {
  AddOutline,
  AlertCircleOutline,
  CalendarOutline,
  CheckmarkCircleOutline,
  GitCommit,
  GitPullRequest,
  ListOutline,
  TrashOutline,
} from '@vicons/ionicons5'

import type { Activity } from '@/capability/repo'
import type { CalendarEvent } from '@/capability/calendar'
import type { Scope } from '@/interfaces'
import type { Task } from '@/capability/task'
import type { StatePort } from '@/interfaces'

const { capabilities, state } = defineProps<{
  capabilities: readonly [ProjectCapabilities]
  state: StatePort<ProjectState>
}>()

const services = capabilities[0]
const projects = ref<readonly Project[]>([])
const selectedProjectName = ref('')
const newProjectName = ref('')
const renameProjectName = ref('')
const error = ref('')
const scopeError = ref('')
const loadingScopes = ref(false)
const loadingData = ref(false)
const repoScopes = ref<readonly Scope[]>([])
const calendarScopes = ref<readonly Scope[]>([])
const taskScopes = ref<readonly Scope[]>([])
const activities = ref<readonly Activity[]>([])
const events = ref<readonly CalendarEvent[]>([])
const tasks = ref<readonly Task[]>([])
const createDialogVisible = ref(false)
const createKind = ref<'repo' | 'calendar' | 'task'>('repo')
const createName = ref('')
const createRepoPrivate = ref(true)
const creating = ref(false)

const selectedProject = computed(() =>
  projects.value.find((project) => project.name === selectedProjectName.value),
)
const createTitle = computed(() =>
  createKind.value === 'repo'
    ? 'Create repository'
    : createKind.value === 'calendar'
      ? 'Create calendar'
      : 'Create task list',
)

const activityMeta = {
  commit: { label: 'Commit', color: '#3b82f6', icon: GitCommit },
  issue: { label: 'Issue', color: '#f59e0b', icon: AlertCircleOutline },
  'pull-request': { label: 'Pull request', color: '#10b981', icon: GitPullRequest },
} as const

function saveState() {
  state.write({
    projects: [...projects.value],
    ...(selectedProjectName.value ? { selectedProjectName: selectedProjectName.value } : {}),
  })
}

function syncState(value: ProjectState) {
  projects.value = value.projects
  const nextName = value.selectedProjectName ?? value.projects[0]?.name ?? ''
  selectedProjectName.value = value.projects.some(({ name }) => name === nextName)
    ? nextName
    : (value.projects[0]?.name ?? '')
  renameProjectName.value = selectedProjectName.value
}

function nameExists(name: string, except?: string) {
  return projects.value.some((project) => project.name === name && project.name !== except)
}

function createProject() {
  const name = newProjectName.value.trim()
  if (!name) {
    error.value = 'Project name is required.'
    return
  }
  if (nameExists(name)) {
    error.value = 'A project with this name already exists.'
    return
  }

  projects.value = [...projects.value, { name, bindings: {} }]
  selectedProjectName.value = name
  renameProjectName.value = name
  newProjectName.value = ''
  error.value = ''
  saveState()
}

function renameProject() {
  const project = selectedProject.value
  const name = renameProjectName.value.trim()
  if (!project || !name) return
  if (nameExists(name, project.name)) {
    error.value = 'A project with this name already exists.'
    return
  }

  projects.value = projects.value.map((item) =>
    item.name === project.name ? { ...item, name } : item,
  )
  selectedProjectName.value = name
  error.value = ''
  saveState()
}

function deleteProject() {
  const project = selectedProject.value
  if (!project) return

  const remaining = projects.value.filter((item) => item.name !== project.name)
  projects.value = remaining
  selectedProjectName.value = remaining[0]?.name ?? ''
  renameProjectName.value = selectedProjectName.value
  error.value = ''
  saveState()
}

function updateBinding(kind: keyof Project['bindings'], value: string | null) {
  const project = selectedProject.value
  if (!project) return

  const bindings = { ...project.bindings }
  if (value) bindings[kind] = value
  else delete bindings[kind]

  projects.value = projects.value.map((item) =>
    item.name === project.name ? { ...item, bindings } : item,
  )
  saveState()
}

function options(scopes: readonly Scope[], binding?: string) {
  const values = scopes.map((scope) => ({ label: scope.name, value: scope.id }))
  if (binding && !scopes.some((scope) => scope.id === binding)) {
    return [{ label: `Unavailable: ${binding}`, value: binding, disabled: true }, ...values]
  }
  return values
}

async function loadScopes() {
  loadingScopes.value = true
  scopeError.value = ''

  const [repositories, calendars, taskLists] = await Promise.allSettled([
    services.repositories?.listScopes() ?? Promise.resolve([]),
    services.calendars?.listScopes() ?? Promise.resolve([]),
    services.tasks?.listScopes() ?? Promise.resolve([]),
  ])

  repoScopes.value = repositories.status === 'fulfilled' ? repositories.value : []
  calendarScopes.value = calendars.status === 'fulfilled' ? calendars.value : []
  taskScopes.value = taskLists.status === 'fulfilled' ? taskLists.value : []
  const failures = [repositories, calendars, taskLists].filter(
    (result): result is PromiseRejectedResult => result.status === 'rejected',
  )
  scopeError.value = failures.length ? 'Some resources could not be loaded.' : ''
  loadingScopes.value = false
}

async function loadData() {
  const bindings = selectedProject.value?.bindings
  if (!bindings) {
    activities.value = []
    events.value = []
    tasks.value = []
    return
  }

  loadingData.value = true
  const now = new Date()
  const from = new Date(now)
  from.setDate(from.getDate() - 7)
  const to = new Date(now)
  to.setDate(to.getDate() + 14)

  const [activityResult, eventResult, taskResult] = await Promise.allSettled([
    bindings.repo && services.repo && services.repositories
      ? services.repositories.forScope(bindings.repo).list({ from, to: now })
      : Promise.resolve([]),
    bindings.calendar && services.calendars
      ? services.calendars.forScope(bindings.calendar).list({ from: now, to })
      : Promise.resolve([]),
    bindings.task && services.tasks
      ? services.tasks.forScope(bindings.task).list()
      : Promise.resolve([]),
  ])

  activities.value = activityResult.status === 'fulfilled' ? activityResult.value : []
  events.value = eventResult.status === 'fulfilled' ? eventResult.value : []
  tasks.value = taskResult.status === 'fulfilled' ? taskResult.value : []
  if ([activityResult, eventResult, taskResult].some((result) => result.status === 'rejected')) {
    error.value = 'Some project data could not be loaded.'
  }
  loadingData.value = false
}

function openCreate(kind: 'repo' | 'calendar' | 'task') {
  createKind.value = kind
  createName.value = selectedProject.value?.name ?? ''
  createRepoPrivate.value = true
  createDialogVisible.value = true
}

async function createScope() {
  const name = createName.value.trim()
  if (!name) return

  creating.value = true
  error.value = ''
  try {
    const scope =
      createKind.value === 'repo'
        ? await services.repositories?.createScope({ name, private: createRepoPrivate.value })
        : createKind.value === 'calendar'
          ? await services.calendars?.createScope(name)
          : await services.tasks?.createScope(name)

    if (!scope) throw new Error('This resource is not connected.')
    updateBinding(createKind.value, scope.id)
    createDialogVisible.value = false
    await loadScopes()
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Failed to create resource.'
  } finally {
    creating.value = false
  }
}

function formatEventTime(event: CalendarEvent) {
  if ('startDate' in event.time) return `${event.time.startDate} - ${event.time.endDate}`
  return `${event.time.startAt.toLocaleString()} - ${event.time.endAt.toLocaleTimeString()}`
}

watch(
  () => state.read(),
  (value) => syncState(value),
  { immediate: true },
)
watch(selectedProjectName, () => {
  renameProjectName.value = selectedProjectName.value
  void loadData()
})
watch(
  () => selectedProject.value?.bindings,
  () => void loadData(),
  { deep: true },
)
watch(
  () => [services.repo, services.repositories, services.calendars, services.tasks],
  () => {
    void loadScopes()
    void loadData()
  },
  { immediate: true },
)
</script>

<template>
  <n-card title="Projects">
    <n-alert v-if="error || scopeError" type="warning" :title="error || scopeError" />
    <div class="project-layout">
      <div>
        <n-space vertical>
          <n-input-group>
            <n-input
              v-model:value="newProjectName"
              placeholder="New project"
              @keyup.enter="createProject"
            />
            <n-button
              type="primary"
              aria-label="Create project"
              title="Create project"
              @click="createProject"
            >
              <template #icon
                ><n-icon><AddOutline /></n-icon
              ></template>
            </n-button>
          </n-input-group>
          <n-list v-if="projects.length" hoverable clickable>
            <n-list-item
              v-for="project in projects"
              :key="project.name"
              :class="{ 'project-list-item--selected': project.name === selectedProjectName }"
              @click="selectedProjectName = project.name"
            >
              <n-thing :title="project.name" />
            </n-list-item>
          </n-list>
          <n-empty v-else description="Create a project to get started." />
        </n-space>
      </div>

      <div>
        <n-empty v-if="!selectedProject" description="Select or create a project." />
        <template v-else>
          <n-flex align="center" justify="space-between" :wrap="true" :size="12">
            <n-input v-model:value="renameProjectName" aria-label="Project name" />
            <n-flex>
              <n-button size="small" type="primary" @click="renameProject">Rename</n-button>
              <n-popconfirm @positive-click="deleteProject">
                <template #trigger>
                  <n-button size="small" type="error" secondary>
                    <template #icon
                      ><n-icon><TrashOutline /></n-icon
                    ></template>
                    Delete
                  </n-button>
                </template>
                Delete this project? External resources will be kept.
              </n-popconfirm>
            </n-flex>
          </n-flex>

          <n-space vertical size="large" style="margin-top: 20px">
            <n-form-item label="Repository">
              <n-input-group>
                <n-select
                  style="flex: 1"
                  :value="selectedProject.bindings.repo"
                  :options="options(repoScopes, selectedProject.bindings.repo)"
                  :disabled="!services.repositories"
                  clearable
                  placeholder="Select repository"
                  @update:value="(value) => updateBinding('repo', value)"
                />
                <n-button
                  :disabled="!services.repositories"
                  aria-label="Create repository"
                  title="Create repository"
                  @click="openCreate('repo')"
                >
                  <template #icon
                    ><n-icon><AddOutline /></n-icon
                  ></template>
                </n-button>
              </n-input-group>
            </n-form-item>
            <n-form-item label="Calendar">
              <n-input-group>
                <n-select
                  style="flex: 1"
                  :value="selectedProject.bindings.calendar"
                  :options="options(calendarScopes, selectedProject.bindings.calendar)"
                  :disabled="!services.calendars"
                  clearable
                  placeholder="Select calendar"
                  @update:value="(value) => updateBinding('calendar', value)"
                />
                <n-button
                  :disabled="!services.calendars"
                  aria-label="Create calendar"
                  title="Create calendar"
                  @click="openCreate('calendar')"
                >
                  <template #icon
                    ><n-icon><AddOutline /></n-icon
                  ></template>
                </n-button>
              </n-input-group>
            </n-form-item>
            <n-form-item label="Task list">
              <n-input-group>
                <n-select
                  style="flex: 1"
                  :value="selectedProject.bindings.task"
                  :options="options(taskScopes, selectedProject.bindings.task)"
                  :disabled="!services.tasks"
                  clearable
                  placeholder="Select task list"
                  @update:value="(value) => updateBinding('task', value)"
                />
                <n-button
                  :disabled="!services.tasks"
                  aria-label="Create task list"
                  title="Create task list"
                  @click="openCreate('task')"
                >
                  <template #icon
                    ><n-icon><AddOutline /></n-icon
                  ></template>
                </n-button>
              </n-input-group>
            </n-form-item>
          </n-space>

          <n-spin :show="loadingScopes || loadingData">
            <n-tabs type="line" animated style="margin-top: 12px">
              <n-tab-pane name="activity" tab="Activity">
                <n-empty
                  v-if="!selectedProject.bindings.repo"
                  description="Bind a repository first."
                />
                <n-timeline v-else-if="activities.length">
                  <n-timeline-item
                    v-for="(activity, index) in [...activities].reverse()"
                    :key="`${activity.kind}-${activity.time.getTime()}-${index}`"
                    :title="activityMeta[activity.kind].label"
                    :time="`${activity.time.toLocaleDateString()} ${activity.time.toLocaleTimeString()}`"
                  >
                    <template #icon>
                      <n-icon :color="activityMeta[activity.kind].color" :size="18">
                        <component :is="activityMeta[activity.kind].icon" />
                      </n-icon>
                    </template>
                    {{ activity.description }}
                  </n-timeline-item>
                </n-timeline>
                <n-empty v-else description="No activity in the last 7 days." />
              </n-tab-pane>
              <n-tab-pane name="calendar" tab="Calendar">
                <n-empty
                  v-if="!selectedProject.bindings.calendar"
                  description="Bind a calendar first."
                />
                <n-list v-else-if="events.length" bordered>
                  <n-list-item v-for="event in events" :key="event.id">
                    <n-thing :title="event.title" :description="formatEventTime(event)">
                      <template #avatar
                        ><n-icon color="#10b981"><CalendarOutline /></n-icon
                      ></template>
                      <template v-if="event.description" #footer>{{ event.description }}</template>
                    </n-thing>
                  </n-list-item>
                </n-list>
                <n-empty v-else description="No events in the next 14 days." />
              </n-tab-pane>
              <n-tab-pane name="tasks" tab="Tasks">
                <n-empty
                  v-if="!selectedProject.bindings.task"
                  description="Bind a task list first."
                />
                <n-list v-else-if="tasks.length" bordered>
                  <n-list-item v-for="task in tasks" :key="task.id">
                    <n-thing :title="task.title" :description="task.notes">
                      <template #avatar>
                        <n-icon :color="task.completed ? '#10b981' : '#f59e0b'">
                          <component :is="task.completed ? CheckmarkCircleOutline : ListOutline" />
                        </n-icon>
                      </template>
                      <template v-if="task.dueDate" #footer>{{ task.dueDate }}</template>
                    </n-thing>
                  </n-list-item>
                </n-list>
                <n-empty v-else description="No tasks in this list." />
              </n-tab-pane>
            </n-tabs>
          </n-spin>
        </template>
      </div>
    </div>
  </n-card>

  <n-modal
    v-model:show="createDialogVisible"
    preset="card"
    :title="createTitle"
    style="width: min(440px, calc(100vw - 32px))"
  >
    <n-space vertical>
      <n-input v-model:value="createName" placeholder="Name" @keyup.enter="createScope" />
      <n-checkbox v-if="createKind === 'repo'" v-model:checked="createRepoPrivate">
        Private repository
      </n-checkbox>
      <n-button
        type="primary"
        block
        :loading="creating"
        :disabled="!createName.trim()"
        @click="createScope"
      >
        Create
      </n-button>
    </n-space>
  </n-modal>
</template>

<style scoped>
.project-layout {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(0, 17fr);
  gap: 24px;
}

.project-list-item--selected {
  background: var(--n-item-color-active);
}

@media (max-width: 767px) {
  .project-layout {
    grid-template-columns: 1fr;
  }
}
</style>
