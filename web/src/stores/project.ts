import { ProjectApi, type ProjectDTO } from '@/api'
import { ref } from 'vue'
import { useAuthenticationStore } from './authentication'
import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', () => {
  const api = new ProjectApi()
  const authenticationStore = useAuthenticationStore()

  const cachedProjectList = ref<ProjectDTO[]>()

  /**
   * Get cached project list.
   * @returns
   */
  async function getProjectList() {
    if (cachedProjectList.value === undefined) {
      await refreshProjectList()
    }
    return cachedProjectList.value!
  }

  /**
   * Refresh cached ProjectList.
   */
  async function refreshProjectList() {
    const res = await api.listProject({
      headers: { Authorization: 'Bearer ' + (await authenticationStore.getAccessToken()) },
    })

    // If this funtion is invoked at least for 1 time, cachedProjectList is asserted to be valid.
    cachedProjectList.value = res.data
  }

  async function createProject(calendarId: string, tasklistId: string) {
    await api.createProject(
      {
        uid: (await authenticationStore.getUid()) as string,
        calendarId: calendarId,
        tasklistId: tasklistId,
      },
      { headers: { Authorization: 'Bearer ' + authenticationStore.getAccessToken() } },
    )
  }

  async function getProject(projectId: string) {
    return (
      await api.getProject(projectId, {
        headers: { Authorization: 'Bearer ' + authenticationStore.getAccessToken() },
      })
    ).data
  }

  return { getProjectList, refreshProjectList, createProject, getProject }
})
