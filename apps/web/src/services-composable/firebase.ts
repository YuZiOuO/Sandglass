// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.SG_WEB_FB_APIKEY,
  authDomain: import.meta.env.SG_WEB_FB_AUTH_DOMAIN,
  projectId: import.meta.env.SG_WEB_FB_PROJECT_ID,
  storageBucket: import.meta.env.SG_WEB_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.SG_WEB_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.SG_WEB_FB_APP_ID,
}

const app = initializeApp(firebaseConfig)

export async function initializeFirebase() {
  await getAuth(app).authStateReady()
}

export function useFirebase() {
  return { app: app, auth: getAuth(app) }
}

export async function useAccessToken() {
  const fbService = useFirebase()
  const user = fbService.auth.currentUser
  return user ? await user.getIdToken() : null
}
