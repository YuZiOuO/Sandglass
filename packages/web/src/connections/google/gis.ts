type GoogleOAuth2 = {
  initTokenClient: (config: {
    client_id: string
    scope: string
    callback: (response: { access_token?: string }) => void
  }) => {
    error_callback?: (error: { type: string }) => void
    requestAccessToken: (overrides: { prompt: '' | 'consent' }) => void
  }
}

function loadGoogleOAuth2() {
  return new Promise<GoogleOAuth2>((resolve, reject) => {
    const googleWindow = window as Window & {
      google?: {
        accounts: {
          oauth2: GoogleOAuth2
        }
      }
    }

    if (googleWindow.google?.accounts.oauth2) {
      resolve(googleWindow.google.accounts.oauth2)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (googleWindow.google?.accounts.oauth2) {
        resolve(googleWindow.google.accounts.oauth2)
        return
      }

      reject(new Error('Google auth is unavailable.'))
    }
    script.onerror = () => reject(new Error('Failed to load Google auth.'))
    document.head.append(script)
  })
}

export async function requestGoogleAccessToken(
  clientId: string,
  scope: string,
  prompt: '' | 'consent',
) {
  const oauth2 = await loadGoogleOAuth2()

  return new Promise<string | undefined>((resolve) => {
    const tokenClient = oauth2.initTokenClient({
      client_id: clientId,
      scope,
      callback: (response) => resolve(response.access_token),
    })

    tokenClient.error_callback = () => resolve(undefined)
    tokenClient.requestAccessToken({ prompt })
  })
}
