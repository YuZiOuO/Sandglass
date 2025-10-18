let loaded = false

const loadGApiPromise = () =>
  new Promise<void>((resolve) => {
    gapi.load('client', () => {
      resolve()
    })
  })

async function loadGApiLibraries() {
  if (loaded) {
    return
  }
  await loadGApiPromise()
  loaded = true
}

export type GApis = 'tasks' | 'calendar'

const discoveryDocumentMap = {
  tasks: 'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest',
  calendar: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
}

export async function useGApi(url: GApis[]) {
  try {
    await loadGApiLibraries()
    gapi.client.init({})
    url.forEach(async (apiName) => {
      await gapi.client.load(discoveryDocumentMap[apiName])
    })
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('Fail to load Google API library: ' + e.message)
    }
  }
}
