import type { CreateTaskInput, Task, TaskCapability, UpdateTaskInput } from '@/capability/task'
import type { Scope, Scoped } from '@/interfaces'

const TASKS_API_ROOT = 'https://tasks.googleapis.com/tasks/v1'

type GoogleTaskListPage = {
  items: Array<{ id: string; title: string }>
  nextPageToken?: string
}

type GoogleTask = {
  id: string
  title: string
  notes?: string
  due?: string
  status: 'completed' | 'needsAction'
}

type GoogleTaskPage = {
  items: GoogleTask[]
  nextPageToken?: string
}

export class GoogleTaskCapability implements Scoped<TaskCapability> {
  constructor(
    private readonly request: (url: string | URL, init?: RequestInit) => Promise<Response>,
  ) {}

  async listScopes() {
    const scopes: Scope[] = []
    const url = new URL(`${TASKS_API_ROOT}/users/@me/lists`)
    let pageToken: string | undefined

    do {
      if (pageToken) url.searchParams.set('pageToken', pageToken)
      const response = await this.request(url)
      const page = (await response.json()) as GoogleTaskListPage
      scopes.push(...page.items.map(({ id, title }) => ({ id, name: title })))
      pageToken = page.nextPageToken
    } while (pageToken)

    return scopes
  }

  forScope(id: string) {
    return new GoogleTaskList(this.request, id)
  }
}

class GoogleTaskList implements TaskCapability {
  constructor(
    private readonly request: (url: string | URL, init?: RequestInit) => Promise<Response>,
    private readonly taskListId: string,
  ) {}

  async list() {
    const tasks: Task[] = []
    const url = this.tasksUrl()
    let pageToken: string | undefined

    do {
      if (pageToken) url.searchParams.set('pageToken', pageToken)
      const response = await this.request(url)
      const page = (await response.json()) as GoogleTaskPage
      tasks.push(...page.items.map(fromGoogleTask))
      pageToken = page.nextPageToken
    } while (pageToken)

    return tasks
  }

  async create(input: CreateTaskInput) {
    const response = await this.request(this.tasksUrl(), {
      method: 'POST',
      body: JSON.stringify(toGoogleTask(input)),
    })
    return fromGoogleTask((await response.json()) as GoogleTask)
  }

  async update(id: string, patch: UpdateTaskInput) {
    const response = await this.request(this.taskUrl(id), {
      method: 'PATCH',
      body: JSON.stringify(toGoogleTask(patch)),
    })
    return fromGoogleTask((await response.json()) as GoogleTask)
  }

  async remove(id: string) {
    await this.request(this.taskUrl(id), { method: 'DELETE' })
  }

  private tasksUrl() {
    return new URL(`${TASKS_API_ROOT}/lists/${encodeURIComponent(this.taskListId)}/tasks`)
  }

  private taskUrl(id: string) {
    return `${this.tasksUrl()}/${encodeURIComponent(id)}`
  }
}

function fromGoogleTask(task: GoogleTask): Task {
  return {
    id: task.id,
    title: task.title,
    ...(task.notes ? { notes: task.notes } : {}),
    ...(task.due ? { dueDate: task.due.slice(0, 10) } : {}),
    completed: task.status === 'completed',
  }
}

function toGoogleTask(input: CreateTaskInput | UpdateTaskInput) {
  return {
    ...(input.title === undefined ? {} : { title: input.title }),
    ...(input.notes === undefined ? {} : { notes: input.notes }),
    ...(input.dueDate === undefined ? {} : { due: `${input.dueDate}T00:00:00.000Z` }),
    ...('completed' in input && input.completed !== undefined
      ? { status: input.completed ? 'completed' : 'needsAction' }
      : {}),
  }
}
